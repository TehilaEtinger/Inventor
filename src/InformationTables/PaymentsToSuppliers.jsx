import { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField } from '@mui/material';
import { collection, query, where, onSnapshot } from 'firebase/firestore';  // Import 'onSnapshot' correctly
import { Timestamp } from 'firebase/firestore';
import db from '../firebase';
import ExportExcel from './ExportExcel';
import { sortArray, isValidDate, isEndDateValid, createTimestamp } from './tableUtils'; // Import the utility functions


export default function PaymentsToSuppliersTable() {
  const [payments, setPayments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [dataToExport, setDataToExport] = useState([]);

  useEffect(() => {
    if (startDate !== '' && endDate !== '') {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      // Check for date errors
      if (!isValidDate(startDateObj)) {
        setDateError('תאריך התחלה לא יכול להיות תאריך עתידי');
        return;
      } else if (!isEndDateValid(startDateObj, endDateObj)) {
        setDateError('תאריך התחלה צריך להיות לפני תאריך סיום');
        return;
      } else {
        setDateError('');
      }

      const start = createTimestamp(startDateObj);
      const end = createTimestamp(new Date(endDateObj.getTime() + 86399999));


      let q = query(
        collection(db, 'supplierPayments'),
        where('date', '>=', start),
        where('date', '<=', end)
      );

      if (selectedManufacturer !== '') {
        q = query(q, where('supplier', '==', selectedManufacturer));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const payData = doc.data();
          return { id: doc.id,
             ...payData,
              date: payData.date?.toDate().toLocaleDateString()};
        });
        setDataToExport(data)
       

        const groupedData = data.reduce((acc, payment) => {
          if (!acc[payment.supplier]) {
            acc[payment.supplier] = [];
          }
          acc[payment.supplier].push(payment);
          return acc;
        }, {});

        const groupedArray = Object.values(groupedData);
        groupedArray.sort((groupA, groupB) => {
          const manufacturerA = groupA[0]?.supplier || '';
          const manufacturerB = groupB[0]?.supplier || '';
          return manufacturerA.localeCompare(manufacturerB);
        });
        
        setPayments(groupedArray);
      
      });

      return () => unsubscribe();
    }
  
  }, [startDate, endDate, selectedManufacturer]);

 

  const calculateTotalAmount = (group) => {
    return group.reduce((total, payment) => total + payment.sum , 0);
  };

  return (
    <Box>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="subtitle1">בחר טווח תאריכים:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            type="date"
            label="עד תאריך"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ marginLeft: '10px' }}
          />
          <Typography variant="body2">עד</Typography>
          <TextField
            type="date"
            label="מתאריך"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ marginRight: '10px' }}
          />
        </Box>
        {dateError && (
          <Typography variant="body2" color="error">
            {dateError}
          </Typography>
        )}
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>סה"כ</TableCell>
              <TableCell>סכום ששולם</TableCell>
              <TableCell>תאריך</TableCell>
              <TableCell>ספק</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((group, index) => (
                group.map((payment, rowIndex) => (
                  <TableRow key={payment.id}>
                    {rowIndex === 0 && (
                      <TableCell rowSpan={group.length} sx={{ fontWeight: 'bold', color: 'blue' }}>
                        {+calculateTotalAmount(group)}
                      </TableCell>
                    )}
                    <TableCell>{payment.sum} ₪</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.supplier}</TableCell>
                  </TableRow>
                ))
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>יש לבחור תאריכים</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {payments.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            סך התשלומים הכולל:
          </Typography>
          <Typography variant="h6">
            {payments.reduce((total, group) => total + calculateTotalAmount(group), 0)} ₪
          </Typography>
        </Box>
      )}
      <ExportExcel data={dataToExport} filename="תשלומים לספקים"  disabled={dataToExport.length === 0}/>
    </Box>
  );
}
