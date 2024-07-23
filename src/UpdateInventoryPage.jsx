import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { collection, onSnapshot } from 'firebase/firestore';
import db from './firebase';
import ProductInStock from './InventoryUpdate/ProductInStock';
import Search from './HomePage/Search';

export default function UpdateInventory() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.stock);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'stock'), snapshot => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
    });

    return () => unsubscribe();
  }, [dispatch]);

  const filterProducts = (input) => {
    setSearchInput(input.toLowerCase());
  };

  const filteredProducts = products.filter(product =>
    product.Name.toLowerCase().includes(searchInput)
  );

  return (
    <div>
      <br />
      <Search onSearch={filterProducts} />
      <div style={styles.container}>
        {filteredProducts.map(product => (
          <ProductInStock key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center',
  },
};
