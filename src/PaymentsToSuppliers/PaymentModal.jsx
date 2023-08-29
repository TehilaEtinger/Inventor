import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import  { useState } from 'react';


const PaymentModal = ({ onPartialPayment, debt }) => {
  const [open, setOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayment = () => {
    const amount = Number(amountPaid);

    // Validate the entered amount
    if (amount <= 0 || amount > debt) {
      alert('יש להזין סכום שקטן מהחוב לספק.');
      return;
    }

    // Call the onPartialPayment function with the amount paid as a number
    onPartialPayment(amount);
    setAmountPaid('');
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleOpen} disabled={debt <= 0}>
        שולם חלקית
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <DialogTitle>תשלום חלקי</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            label="סכום לתשלום"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ביטול</Button>
          <Button onClick={handlePayment} color="primary" variant="contained">
            אישור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentModal;
