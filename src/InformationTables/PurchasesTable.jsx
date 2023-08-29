import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField } from '@mui/material';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import db from '../firebase';
import ExportExcel from './ExportExcel';
import { isValidDate, isEndDateValid, createTimestamp } from './tableUtils';

export default function PurchasesTable() {
  const [purchases, setPurchases] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [dataToExport, setDataToExport] = useState([]);

  useEffect(() => {
    if (startDate !== '' && endDate !== '') {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

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

      const q = query(collection(db, 'sold'), where('purchaseDate', '>=', start), where('purchaseDate', '<=', end));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const purchaseData = doc.data();
          return {
            id: doc.id,
            ...purchaseData,
            purchaseDate: purchaseData.purchaseDate?.toDate().toLocaleDateString(),
          };
        });
        setDataToExport(data);

        const groupedData = data.reduce((acc, purchase) => {
          if (!acc[purchase.Name]) {
            acc[purchase.Name] = [];
          }
          acc[purchase.Name].push(purchase);
          return acc;
        }, []);

        const groupedArray = Object.values(groupedData);
        groupedArray.sort((groupA, groupB) => {
          const manufacturerA = groupA[0]?.Manufacturer || '';
          const manufacturerB = groupB[0]?.Manufacturer || '';
          return manufacturerA.localeCompare(manufacturerB);
        });

        setPurchases(groupedArray);
      });

      return () => unsubscribe();
    }
  }, [startDate, endDate]);

  const getTotalPurchases = (group) => {
    return group.reduce((total, purchase) => total + purchase.Quantity, 0);
  };

  const calculateTotalProfit = (group) => {
    return group.reduce((total, purchase) => total + (purchase.CustomerPrice - purchase.ManufacturerPrice) * purchase.Quantity, 0);
  };

  return (
    <Box>
  

    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant="subtitle1">בחר טווח תאריכים:</Typography>
      {/* Date pickers to select the date range */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          type="date"
          label="עד תאריך"
          value={endDate}
          onChange={(e) => { setEndDate(e.target.value)}}
          sx={{ marginLeft: '10px' }}
        />
        <Typography variant="body2">עד</Typography>
        <TextField
          type="date"
          label="מתאריך"
          value={startDate}
          onChange={(e) => { setStartDate(e.target.value) }}
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
              <TableCell>סה"כ רכישות</TableCell>
              <TableCell>כמות</TableCell>
              <TableCell>מחיר לצרכן</TableCell>
              <TableCell>מחיר יצרן</TableCell>
              <TableCell>יצרן</TableCell>
              <TableCell>תאריך רכישה</TableCell>
              <TableCell>אמצעי תשלום</TableCell>
              <TableCell>שם מוצר</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.length > 0 ? (
              purchases.map((group, index) => (
                group.map((purchase, rowIndex) => (
                  <TableRow key={purchase.id}>
                    {rowIndex === 0 && (
                      <TableCell rowSpan={group.length} sx={{ fontWeight: 'bold', color: 'blue' }}>
                        {+getTotalPurchases(group)}
                      </TableCell>
                    )}
                    <TableCell>{purchase.Quantity} </TableCell>
                    <TableCell>{purchase.CustomerPrice} ₪</TableCell>
                    <TableCell>{purchase.ManufacturerPrice} ₪</TableCell>
                    <TableCell>{purchase.Manufacturer}</TableCell>
                    <TableCell>{purchase.purchaseDate}</TableCell>
                    <TableCell>{purchase.paymentMethod}</TableCell>
                    <TableCell>{purchase.Name}</TableCell>

                  </TableRow>
                ))
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>Loading...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
       {/* Final Summary */}
       {purchases.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            סך הרווחים הכוללים:
          </Typography>
          <Typography variant="h6">
            {purchases.reduce((total, group) => total + calculateTotalProfit(group), 0)} ₪
          </Typography>
        </Box>
      )}
      <ExportExcel data={dataToExport} filename="טבלת רכישות" disabled={dataToExport.length === 0}/>
    </Box>
  );
}







