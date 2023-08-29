import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';


import {  useNavigate } from 'react-router-dom'; 
import { Box,  Button, Grid,  Container } from '@mui/material';
import { collection, addDoc,getDocs, updateDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import db from './firebase';
import ShoppingBasket from './Payment/ShoppingBasket';
import CancelIcon from '@mui/icons-material/Cancel';

export default function Payment() {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch(); 
  const nav = useNavigate()
  

 

  const updateSoldTable = async (method) => {
    try {
      // Loop through the cart items and add each item as a separate record in the SOLD table
      for (const cartItem of cart) {
        const soldData = {
          Name: cartItem.Name,
          ManufacturerPrice: cartItem.ManufacturerPrice,
          CustomerPrice: cartItem.CustomerPrice,
          Manufacturer: cartItem.Manufacturer,
          Quantity: cartItem.quantity,
          purchaseDate: Timestamp.now(),
          paymentMethod: method,
        };
  
        // Calculate the debt to the supplier
        const debtToSupplier = cartItem.quantity * cartItem.ManufacturerPrice;
  
        // Add the sold data to the SOLD table in Firestore
        await addDoc(collection(db, 'sold'), soldData);
  
        // Update the stock quantity after each product is sold
        const productRef = doc(db, 'stock', cartItem.id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const currentStockQuantity = productDoc.data().Quantity;
          const updatedStockQuantity = currentStockQuantity - cartItem.quantity;
          await updateDoc(productRef, {
            Quantity: updatedStockQuantity,
          });
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id: cartItem.id, quantity: updatedStockQuantity } });

          console.log(`Stock quantity for product ${cartItem.Name} updated successfully!`);
        } else {
          console.error(`Product with ID ${cartItem.id} not found in stock.`);
        }
  
        // Update the supplier's totalDebt in the Suppliers table
        if (cartItem.Manufacturer) {
          const suppliersRef = collection(db, 'suppliers');
          const querySnapshot = await getDocs(suppliersRef);
          const supplierDoc = querySnapshot.docs.find(
            (doc) => doc.data().name === cartItem.Manufacturer
          );
  
          if (supplierDoc) {
            const supplierId = supplierDoc.id;
            const currentDebt = supplierDoc.data().totalDebt;
            const updatedDebt = currentDebt + debtToSupplier;
  
            await updateDoc(doc(db, 'suppliers', supplierId), {
              totalDebt: updatedDebt,
            });
  
            console.log(`Debt to supplier ${cartItem.Manufacturer} updated successfully!`);
          }
        }
      }
  
      console.log('Products added to the SOLD table successfully!');
      // Reset the cart by dispatching an action to clear it
      dispatch({ type: 'CLEAR_CART' });
      // Navigate back to the home page after the payment is successful
  
    } catch (error) {
      console.error('Error adding products to the SOLD table:', error);
    }
  };
  
  
  const handlePaymentCash = () => {
    updateSoldTable('מזומן');
    nav('/');
    // Optionally, you can add other logic here for handling the payment process
  };
  const handlePaymentCredit = () => {
    updateSoldTable('אשראי');
    nav('/');
    // Optionally, you can add other logic here for handling the payment process

  };
  const handleCancle = () => {
    dispatch({ type: 'CLEAR_CART' });
    nav('/');
    // Optionally, you can add other logic here for handling the payment process

  };



  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding="16px"
      >
       
          <ShoppingBasket />
         
       
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="secondary" startIcon={<CancelIcon />} onClick={handleCancle}>
              ביטול
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="primary" onClick={handlePaymentCash}>
              תשלום במזומן
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button fullWidth variant="contained" color="primary" onClick={handlePaymentCredit}>
              תשלום באשראי
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
          }