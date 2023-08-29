import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const ConfirmationDialog = ({ open, title, message, onOk, onCancel }) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>ביטול</Button>
        <Button onClick={onOk} color="primary" variant="contained">
          אישור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
