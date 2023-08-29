import  { useState } from 'react';
import { Box, Typography, Container, Paper, IconButton } from '@mui/material';
import PurchasesTable from './InformationTables/PurchasesTable'
import StockTable from './InformationTables/StockTable';
import LossesTable from './InformationTables/LossesTable';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import PaymentsToSuppliersTable from './InformationTables/PaymentsToSuppliers';

export default function ViewInventory() {
  const [isStockTableVisible, setStockTableVisible] = useState(false);
  const [isPurchasesTableVisible, setPurchasesTableVisible] = useState(false);
  const [isLossesTableVisible, setLossesTableVisible] = useState(false);
  const [isPaymentsToSuppliersVisible, setPaymentsToSuppliersVisible] = useState(false);

  

  const toggleStockTableVisibility = () => {
    setStockTableVisible((prevVisibility) => !prevVisibility);
  };
  
  const togglePaymentsToSuppliersVisibility = () => {
    setPaymentsToSuppliersVisible((prevVisibility) => !prevVisibility);
  };

  const togglePurchasesTableVisibility = () => {
    setPurchasesTableVisible((prevVisibility) => !prevVisibility);
  };

  const toggleLossesTableVisibility = () => {
    setLossesTableVisible((prevVisibility) => !prevVisibility);
  };
  
  return (
    <Container maxWidth="lg">
      
      <Box mt={8}>
        <Paper elevation={3} >
          <Box p={3} mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" >
              <Typography variant="h5" gutterBottom>
                טבלת מלאי
              </Typography>
              <IconButton onClick={toggleStockTableVisibility} size="small">
                {isStockTableVisible ? <ArrowUpward /> : <ArrowDownward />}
              </IconButton>
            </Box>
            {isStockTableVisible && <StockTable />}
          </Box>
        </Paper>

        <Paper elevation={3}>
          <Box p={3} mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" gutterBottom>
                טבלת רכישות
              </Typography>
              <IconButton onClick={togglePurchasesTableVisibility} size="small">
                {isPurchasesTableVisible ? <ArrowUpward /> : <ArrowDownward />}
              </IconButton>
            </Box>
            {isPurchasesTableVisible && <PurchasesTable />}
          </Box>
        </Paper>

        <Paper elevation={3}>
          <Box p={3} mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" gutterBottom>
                תשלומים שבוצעו לספקים 
              </Typography>
              <IconButton onClick={togglePaymentsToSuppliersVisibility} size="small">
                {isPaymentsToSuppliersVisible ? <ArrowUpward /> : <ArrowDownward />}
              </IconButton>
            </Box>
            {isPaymentsToSuppliersVisible && <PaymentsToSuppliersTable />}
          </Box>
        </Paper>

        <Paper elevation={3}>
          <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" gutterBottom>
                טבלת הפסדים
              </Typography>
              <IconButton onClick={toggleLossesTableVisibility} size="small">
                {isLossesTableVisible ? <ArrowUpward /> : <ArrowDownward />}
              </IconButton>
            </Box>
            {isLossesTableVisible && <LossesTable />}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
