import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import db from "../firebase";
import { Button, TextField, Box, Typography , Switch, FormControlLabel} from '@mui/material';
import { Edit, Save, Cancel, Delete } from '@mui/icons-material';

export default function ProductDetails({ product }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const defaultProductValues = {
    Name: '',
    CustomerPrice: 0,
    ManufacturerPrice: 0,
    Manufacturer: '',
    Picture: '',
    Quantity: 0,
    Category: '',
    Returns: false,
  };
  const [updatedProduct, setUpdatedProduct] = useState({
    ...defaultProductValues,
    ...(product || {}), // Merge with product values if available
  });
  const handleUpdateProduct = () => {
    // Dispatch an action to update the product in the state
    dispatch({ type: 'UPDATE_PRODUCT', payload: { id: product.id, data: updatedProduct } });

    // Update the product in the database
    const productRef = doc(db, 'stock', product.id);
    updateDoc(productRef, updatedProduct)
      .then(() => {
        console.log("Product updated successfully in the database");
        checkAndAddSupplier(updatedProduct.Manufacturer);
      })
      .catch((error) => {
        console.error("Error updating product in the database:", error);
      });

    // Exit the editing mode
    setIsEditing(false);
  };

  const handleDeleteProduct = () => {
    // Show a confirmation dialog before deleting the product
    const shouldDelete = window.confirm('למחוק את המוצר?');
    if (!shouldDelete) {
      return; // If the user cancels, do nothing
    }

    // Dispatch an action to remove the product from the state
    dispatch({ type: 'DELETE_PRODUCT', payload: product.id });

    // Delete the product from the database
    const productRef = doc(db, 'stock', product.id);
    deleteDoc(productRef)
      .then(() => {
        console.log("Product deleted successfully from the database");
      })
      .catch((error) => {
        console.error("Error deleting product from the database:", error);
      });
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
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {updatedProduct.Name}
        </Typography>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} startIcon={<Edit />}>
            עריכה
          </Button>
        ) : (
          <Box>
            <Button onClick={handleUpdateProduct} startIcon={<Save />} sx={{ marginRight: 1 }}>
              שמירה
            </Button>
            <Button onClick={() => setIsEditing(false)} startIcon={<Cancel />}>
              ביטול
            </Button>
          </Box>
        )}
        <Button onClick={handleDeleteProduct} startIcon={<Delete />} sx={{ color: 'red' }}>
          מחיקת המוצר
        </Button>
      </Box>

      <Box>
        <TextField
          id="name"
          label="שם המוצר"
          value={updatedProduct.Name}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, Name: e.target.value })}
          fullWidth
          disabled={!isEditing}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          id="customerPrice"
          label="מחיר ללקוח"
          type="number"
          min="0"
          value={updatedProduct.CustomerPrice}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, CustomerPrice: e.target.value })}
          fullWidth
          disabled={!isEditing}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          id="manufacturerPrice"
          label="מחיר יצרן"
          type="number"
          min="0"
          value={updatedProduct.ManufacturerPrice}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, ManufacturerPrice: e.target.value })}
          fullWidth
          disabled={!isEditing}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          id="manufacturer"
          label="יצרן"
          value={updatedProduct.Manufacturer}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, Manufacturer: e.target.value })}
          fullWidth
          disabled={!isEditing}
          sx={{ marginBottom: 2 }}
        />
        
        <TextField
          id="picture"
          label="קישור לתמונה"
          value={updatedProduct.Picture}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, Picture: e.target.value })}
          fullWidth
          disabled={!isEditing}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          id="quantity"
          label="כמות"
          type="number"
          min="0"
          value={updatedProduct.Quantity}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, Quantity: e.target.value })}
          fullWidth
          disabled={!isEditing}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          id="category"
          label="קטגוריה"
          type="text"
          value={updatedProduct.Category}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, Category: e.target.value })}
          fullWidth
          disabled={!isEditing}
          sx={{ marginBottom: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={updatedProduct.Returns}
              onChange={(e) => setUpdatedProduct({ ...updatedProduct, Returns: e.target.checked })}
            />
          }
          disabled={!isEditing}
          label="החזרות"
          sx={{ marginBottom: 2 }}
          id="returns"
        />
      </Box>
    </Box>
  );
}
