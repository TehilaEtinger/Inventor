import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function PaymentBar({ totalPrice, countProductsInCart }) {
  const nav = useNavigate();

  // Style for circular container
  const circleContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed', // Fix the container
    top: '50%', // Position at the middle vertically
    left: '20px', // Set the left position to create a margin from the left side
    transform: 'translateY(-50%)', // Adjust the vertical positioning to center the container
  };

  // Style for smaller circular container
  const circleStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#f1f1f1',
  };

  return (
    <Box sx={circleContainerStyle}>
      <Box sx={circleStyle}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => nav('/payment')}
          sx={{ borderRadius: '50px', width: '60%', height: '60%' }}
        >
          לתשלום
        </Button>
      </Box>

      <Box sx={circleStyle}>
        <Typography variant="h6">₪{totalPrice}</Typography>
      </Box>

      <Box sx={circleStyle}>
        <IconButton aria-label="cart">
          <StyledBadge badgeContent={countProductsInCart} color="secondary">
            <ShoppingCartIcon />
          </StyledBadge>
        </IconButton>
      </Box>
    </Box>
  );
}
