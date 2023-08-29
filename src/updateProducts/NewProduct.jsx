import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDoc, collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import { Box, Typography, Button, TextField, FormControlLabel, Switch } from '@mui/material';

export default function NewProduct({ onClose }) {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState({
    Name: '',
    ManufacturerPrice: '',
    CustomerPrice: '',
    Manufacturer: '',
    ManufacturerPrice: '',
    Picture: '',
    Quantity: '',
    Returns: false,
    Category: '',
  });

  const handleAddProduct = async () => {
    // Add the product to the database
    try {
      const productRef = await addDoc(collection(db, 'stock'), productData);
      console.log("Product added successfully to the database");
      // Dispatch an action to add the product to the state
      dispatch({ type: 'ADD_PRODUCT', payload: { id: productRef.id, data: productData } });
      checkAndAddSupplier(productData.Manufacturer);
      // Close the modal after adding the product
      onClose();
    } catch (error) {
      console.error("Error adding product to the database:", error);
    }
  };

  const checkAndAddSupplier = async (manufacturerName) => {
    if (!manufacturerName) {
      return; // No manufacturer name provided, exit the function
    }
  
    try {
      // Query the "suppliers" table to check if the manufacturer/supplier exists
      const suppliersRef = collection(db, 'suppliers');
      const querySnapshot = await getDocs(suppliersRef);
  
      // Check if the manufacturer/supplier already exists
      const existingSupplier = querySnapshot.docs.find(
        (doc) => doc.data().name === manufacturerName
      );
  
      if (!existingSupplier) {
        // If the supplier doesn't exist, add it to the "suppliers" table with an initial total debt of 0
        await addDoc(suppliersRef, {
          name: manufacturerName,
          totalDebt: 0,
        });
        console.log(`Supplier "${manufacturerName}" added to the suppliers table.`);
      }
    } catch (error) {
      console.error("Error checking and adding supplier:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">
       הוספת מוצר חדש
      </Typography>
      <TextField
        id="name"
        label="שם המוצר"
        value={productData.Name}
        onChange={(e) => setProductData({ ...productData, Name: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        id="customerPrice"
        label="מחיר ללקוח"
        type="number"
        min="0"
        value={productData.CustomerPrice}
        onChange={(e) => setProductData({ ...productData, CustomerPrice: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      
      <TextField
        id="manufacturerPrice"
        label="מחיר יצרן"
        type="number"
        min="0"
        value={productData.ManufacturerPrice}
        onChange={(e) => setProductData({ ...productData, ManufacturerPrice: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

<TextField
        id="manufacturer"
        label="יצרן"
        value={productData.Manufacturer}
        onChange={(e) => setProductData({ ...productData, Manufacturer: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <TextField
        id="picture"
        label="קישור לתמונה"
        value={productData.Picture}
        onChange={(e) => setProductData({ ...productData, Picture: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        id="quantity"
        label="כמות"
        type="number"
        min="0"
        value={productData.Quantity}
        onChange={(e) => setProductData({ ...productData, Quantity: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        id="category"
        label="קטגוריה"
        value={productData.Category}
        onChange={(e) => setProductData({ ...productData, Category: e.target.value })}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={productData.Returns}
            onChange={(e) => setProductData({ ...productData, Returns: e.target.checked })}
          />
        }
        label="החזרות"
        sx={{ marginBottom: 2 }}
      />
      <Button onClick={handleAddProduct} variant="contained" color="primary">
        הוסף מוצר
      </Button>
    </Box>
  );
}
