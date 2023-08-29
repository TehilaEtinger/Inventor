import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDoc, addDoc, doc, collection,Timestamp,getDocs } from "firebase/firestore";
import db from "../firebase";
import { Box, Typography, Button, IconButton, TextField, Modal } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

export default function ProductInStock({ product }) {
  const dispatch = useDispatch();
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [operation, setOperation] = useState('add');
  const [inputError, setInputError] = useState(false);
  
 const cachedStock = useSelector(state => state.stock);

  // Find the current product in the cached stock data
  const cachedProduct = cachedStock.find(item => item.id === product.id);
  const handleAddToInventory = () => {
    setOperation('add');
    setInputError(false);
    setShowConfirmation(true);
  };

  const handleReduceFromInventory = () => {
    setOperation('reduce');
    setInputError(false);
    setShowConfirmation(true);
  };

  const handleLosses = () => {
    setOperation('losses');
    setInputError(false);
    setShowConfirmation(true);
  };

  const handleConfirmationOk = async () => {
    let updatedQuantity=parseInt(product.Quantity, 10)
    if (operation === 'losses'|| operation === 'reduce') {
       updatedQuantity = parseInt(product.Quantity, 10) - parseInt(quantityToAdd, 10);
    }
    if (operation === 'add') {
       updatedQuantity = parseInt(product.Quantity, 10) + parseInt(quantityToAdd, 10);
    }
    if (updatedQuantity < 0) {
        setInputError(true);
        return;
      }
  
      // Update the product in the database
      const productRef = doc(db, 'stock', product.id);
      await updateDoc(productRef, { Quantity: updatedQuantity });
      // Dispatch an action to update the product quantity in the state
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: product.id, quantity: updatedQuantity } });
      if (operation === 'losses') {
      // Calculate the debt to the supplier based on the quantity discarded and manufacturer's price
      const debtToSupplier = quantityToAdd * product.ManufacturerPrice;
  
      // Update the supplier's totalDebt in the Suppliers table
      if (product.Manufacturer) {
        const suppliersRef = collection(db, 'suppliers');
        const querySnapshot = await getDocs(suppliersRef);
        const supplierDoc = querySnapshot.docs.find(
          (doc) => doc.data().name === product.Manufacturer
        );
  
        if (supplierDoc) {
          const supplierId = supplierDoc.id;
          const currentDebt = supplierDoc.data().totalDebt;
          const updatedDebt = currentDebt + debtToSupplier;
  
          await updateDoc(doc(db, 'suppliers', supplierId), {
            totalDebt: updatedDebt,
          });
  
          console.log(`Debt to supplier ${product.Manufacturer} updated successfully!`);
        }
      }
  
      // Add the product to the losses table
      const lossesData = {
        Manufacturer: product.Manufacturer,
        ManufacturerPrice: product.ManufacturerPrice,
        Name: product.Name,
        Quantity: quantityToAdd,
        Date: Timestamp.now()
      };
      await addDoc(collection(db, 'losses'), lossesData);
    }
    // Cache the updated quantityToAdd in session storage
    sessionStorage.setItem(`cachedProduct_${product.id}`, JSON.stringify({ quantityToAdd }));
    // Clear the cached item from session storage
    sessionStorage.removeItem(`cachedProduct_${product.id}`);
    // Reset the quantityToAdd and hide the confirmation modal
    setQuantityToAdd(1);
    setInputError(false);
    setShowConfirmation(false);
  };

  const handleConfirmationCancel = () => {
    // Reset the quantityToAdd and hide the confirmation modal
    setQuantityToAdd(1);
    setInputError(false);
    setShowConfirmation(false);
  };

  const handleKeyPress = (e) => {
    const keyPressed = e.key;
    // Allow only numbers and the backspace key
    if (!/[0-9]|Backspace/.test(keyPressed)) {
      e.preventDefault();
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minWidth: '300px', maxWidth: '400px', padding: '16px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', background: '#fff' }}>
    <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">
          {product.Name}
        </Typography>
        <Typography variant="body1">
          מחיר יצרן: {product.ManufacturerPrice} ש"ח
        </Typography>
        <Typography variant="body1">
          מחיר ללקוח: {product.CustomerPrice} ש"ח
        </Typography>
        <Typography variant="body1">
          כמות במלאי: {+product.Quantity}
        </Typography>
        <br></br>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2  }}>
      <TextField
        type="number"
        label=" כמות להוספה\ החסרה\ זריקה"
        value={quantityToAdd}
        onChange={(e) => setQuantityToAdd(e.target.value)}
        InputProps={{ inputProps: { min: 1 } }}
        onKeyPress={handleKeyPress} // Add the onKeyPress event handler
        sx={{ width: '12rem', textAlign: 'center', mb: 1 }}
      />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleAddToInventory} color="primary" size="small">
            <Add />
          </IconButton>
          <IconButton onClick={handleReduceFromInventory} color="primary" size="small" disabled={product.Quantity < quantityToAdd}>
            <Remove />
          </IconButton>
          {product.Returns === false && (
            <Button onClick={handleLosses} color="primary" size="small" disabled={product.Quantity < quantityToAdd}>
              נזרקו לפח
            </Button>
          )}
        </Box>
      </Box>

      {/* Confirmation Modal */}
      <Modal
        open={showConfirmation}
        onClose={handleConfirmationCancel}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '8px' }}>
          <Typography variant="h6" id="confirmation-modal-title">
            אישור עדכון המלאי
          </Typography>
          <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
            {inputError ? "קלט לא תקין" : "האם אתה בטוח שאתה רוצה לעדכן את המלאי?"}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={handleConfirmationCancel} color="primary" sx={{ mr: 2 }}>
              ביטול
            </Button>
            {!inputError && (
              <Button onClick={handleConfirmationOk} variant="contained" color="primary">
                אישור
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
