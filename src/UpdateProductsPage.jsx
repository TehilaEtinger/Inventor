import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { collection, onSnapshot } from 'firebase/firestore';
import db from './firebase';
import ProductDetails from './updateProducts/ProductDetails';
import NewProduct from './updateProducts/NewProduct';
import { Fab, Modal, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function UpdatedProducts() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.stock);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'stock'), snapshot => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleAddProductClick = () => {
    setShowAddProductModal(true);
  };

  const handleModalClose = () => {
    setShowAddProductModal(false);
  };

  return (
    <div>
      <br />
      <div style={styles.container}>
        {products.map(product => (
          <ProductDetails key={product.id} product={product} />
        ))}
        <Fab color="primary" aria-label="add" style={styles.fab} onClick={handleAddProductClick}>
          <AddIcon />
        </Fab>
        <Modal
          open={showAddProductModal}
          onClose={handleModalClose}
          aria-labelledby="add-product-modal-title"
          aria-describedby="add-product-modal-description"
        >
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '8px' }}>
            <NewProduct onClose={handleModalClose} />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  fab: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
  },
};
