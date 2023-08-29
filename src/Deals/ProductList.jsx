import React from 'react';
import { List, ListItem, ListItemText, Checkbox, Paper } from '@mui/material';

const ProductList = ({ products, selectedProducts, onProductToggle }) => {
  return (
    <Paper elevation={2} style={{ padding: '16px' }}>
      <List>
        {products.map((product) => (
          <ListItem key={product.id} disablePadding>
            <ListItemText primary={product.name} />
            <Checkbox
              checked={selectedProducts.includes(product.id)}
              onChange={() => onProductToggle(product.id)}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ProductList;
