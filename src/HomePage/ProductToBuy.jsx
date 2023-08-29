import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Add, Remove, Delete, Save } from '@mui/icons-material';

export default function ProductToBuy(props) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isQuantityChanged, setIsQuantityChanged] = useState(false); // Track if quantity changed

  const dispatch = useDispatch();

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    // Ensure the quantity value is not negative or empty
    if (value === '' || parseInt(value) >= 0) {
      setQuantity(parseInt(value));
      if (addedToCart) {
        setIsQuantityChanged(true);
      }
    }
  };

  const handleIncrementQuantity = () => {
    setQuantity(quantity + 1);
    if (addedToCart) {
      setIsQuantityChanged(true);
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
    if (addedToCart) {
      setIsQuantityChanged(true);
    }
  };

  const handleAddToCart = () => {
    // Dispatch the 'ADD_TO_CART' action with the product details
    dispatch({ type: 'ADD_TO_CART', payload: { ...props.product, quantity } });

    setAddedToCart(true);
  };

  const handleUpdateCart = () => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: props.product.id, quantity } });
    setIsQuantityChanged(false);
  };

  const handleRemoveFromCart = () => {
    // Dispatch the 'REMOVE_FROM_CART' action with the product details
    dispatch({ type: 'REMOVE_FROM_CART', payload: props.product.id });

    setAddedToCart(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '200px',
        margin: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <img
        src={props.product.Picture}
        alt={props.product.Name}
        style={{
          width: '100%',
          height: '100px',
          objectFit: 'cover',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      />
      <Box sx={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '8px', flexGrow: 1 }}>
          {props.product.Name}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: '8px', textAlign: 'center', flexGrow: 1 }}>
          {props.product.CustomerPrice} ש"ח
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <IconButton onClick={handleDecrementQuantity} color="primary" size="small" sx={{ border: '1px solid #ccc', borderRadius: '4px' }}>
            <Remove />
          </IconButton>
          <TextField
            type="number"
            value={quantity} // Use local state variable 'quantity'
            onChange={handleQuantityChange}
            inputProps={{ min: 1 }}
            style={{
              width: '70px',
              textAlign: 'center',
              margin: '0 8px',
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          />

          <IconButton onClick={handleIncrementQuantity} color="primary" size="small" sx={{ border: '1px solid #ccc', borderRadius: '4px' }}>
            <Add />
          </IconButton>
        </Box>
        {isQuantityChanged ? (
        <Button variant="contained" color="secondary" onClick={handleUpdateCart} sx={{ width: '100%', borderRadius: '4px' }}>
          <Save sx={{ marginRight: '8px' }} />
          שמור שינויים
        </Button>
      ) : null}
      {addedToCart ? (
        <Button variant="contained" color="secondary" onClick={handleRemoveFromCart} sx={{ width: '100%', borderRadius: '4px', marginTop: '8px' }}>
          <Delete sx={{ marginRight: '8px' }} />
          הסר מהעגלה
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleAddToCart} sx={{ width: '100%', borderRadius: '4px', marginTop: '8px' }}>
          <Add sx={{ marginRight: '8px' }} />
          הוסף לעגלה
        </Button>
      )}
      </Box>
    </Box>
  );
}
