import  { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { TextField, Badge} from '@mui/material';
import MoneyIcon from '@mui/icons-material/Money';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ShoppingBasket = () => {
  const products = useSelector((state) => state.cart);

  // Group products based on their quantity
  const groupedProducts = products.reduce((acc, product) => {
    const existingProduct = acc.find((p) => p.Name === product.Name && p.CustomerPrice === product.CustomerPrice);

    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      acc.push({ ...product });
    }

    return acc;
  }, []);

  // Calculate total price and other relevant information about products
  const totalItems = groupedProducts.reduce((total, product) => total + product.quantity, 0);
  const totalPrice = groupedProducts.reduce((total, product) => total + product.CustomerPrice * product.quantity, 0);

  // State variables for amount paid and change
  const [amountPaid, setAmountPaid] = useState('');
  const change = amountPaid ? parseFloat(amountPaid) - totalPrice : 0;

  const handleChange = (event) => {
    setAmountPaid(event.target.value);
  };

  return (
    <Paper style={{ padding: '16px', margin: '16px', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        <Badge badgeContent={totalItems} color="secondary">
          <ShoppingCartIcon fontSize="large" />
        </Badge>
      </Typography>
      {groupedProducts.map((product, i) => (
        <div key={i}>
          <Typography variant="subtitle1">
            {product.Name} - ₪{product.CustomerPrice} x {product.quantity}
          </Typography>
        </div>
      ))}
      <br></br>
      
      <Typography variant="h6" gutterBottom>
        לתשלום: ₪{totalPrice}
      </Typography>
      <div style={{ marginTop: '16px' }}>
        <TextField
          type="number"
          label="סכום שהתקבל במזומן (₪)"
          value={amountPaid}
          onChange={handleChange}
          fullWidth
          InputProps={{
            startAdornment: <MoneyIcon />,
          }}
        />
        {change > 0 && (
          <Typography variant="h6" gutterBottom style={{ marginTop: '8px' }}>
            עודף: ₪{change.toFixed(2)}
          </Typography>
        )}
      </div>
    </Paper>
  );
};

export default ShoppingBasket;
