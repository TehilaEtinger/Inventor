import React, { useState } from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';

const DiscountDetailsForm = ({ selectedTemplate, handleSubmitDetails }) => {
  
  const [discountDetails, setDiscountDetails] = useState({});
  
  return (
    <Paper elevation={2} style={{ padding: '16px' }}>
      {selectedTemplate === 'percentage' && (
        <TextField
          label="הנחה%"
          variant="outlined"
          fullWidth
          required
          type='number'
          
          onChange={(e)=>setDiscountDetails({...discountDetails,name:'percentage',p:(e.target.value)})}
        />
      )}
      {selectedTemplate === 'buy_get_free' && (
        <>
          <TextField
            label="קנה"
            variant="outlined"
            fullWidth
            required
            type='number'
            
            onChange={(e)=>setDiscountDetails({...discountDetails,name:'buy_get_free',buy:(e.target.value)})}
          />
          <TextField
            label="קבל חינם"
            variant="outlined"
            fullWidth
            required
            type='number'
            
            onChange={(e)=>setDiscountDetails({...discountDetails,name:'buy_get_free',get:(e.target.value)})}

          />
        </>
      )}
       {selectedTemplate === 'buy_pay_' && (
        <>
          <TextField
            label="קנה"
            variant="outlined"
            fullWidth
            required
            type='number'
            onChange={(e)=>setDiscountDetails({...discountDetails,name:'buy_pay_',buy:(e.target.value)})}

          />
          <TextField
            label="שלם "
            variant="outlined"
            fullWidth
            required
            type='number'
            onChange={(e)=>setDiscountDetails({...discountDetails,name:'buy_pay_',pay:(e.target.value)})}
          />
        </>
      )}
       {selectedTemplate === 'the_in_%' && (
        <>
          <TextField
            label="קנה"
            variant="outlined"
            fullWidth
            required
            type='number'
            onChange={(e)=>setDiscountDetails({...discountDetails,name:'the_in_%',buy:(e.target.value)})}
          />
          <TextField
            label="קבל % הנחה "
            variant="outlined"
            fullWidth
            required
            min='0'
            type='number'
            onChange={(e)=>setDiscountDetails({...discountDetails,name:'the_in_%',p:(e.target.value)})}
          />
        </>
      )}
      {/* Other template-specific input fields */}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={() => {sessionStorage.setItem('dealData', JSON.stringify(discountDetails));handleSubmitDetails}}>
          Continue
        </Button>
      </Box>
    </Paper>
  );
};

export default DiscountDetailsForm;
