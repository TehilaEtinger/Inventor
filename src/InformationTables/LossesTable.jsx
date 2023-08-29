import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField } from '@mui/material';
import { collection, query, where, onSnapshot} from 'firebase/firestore';
import { sortArray, isValidDate, isEndDateValid, createTimestamp } from './tableUtils'; // Import the utility functions
import db from '../firebase';
import ExportExcel from './ExportExcel';

export default function LossesTable() {
  const [losses, setLosses] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [dataToExport, setDataToExport] = useState([]);

  // Load cached data from session storage on component mount
  useEffect(() => {
    const cachedLosses = sessionStorage.getItem('cachedLosses');
    if (cachedLosses) {
      setLosses(JSON.parse(cachedLosses));
    }
  }, []);

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

      const q = query(collection(db, 'losses'), where('Date', '>=', start), where('Date', '<=', end));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          const lossesData = doc.data();

          return {
            id: doc.id,
            ...lossesData,
            Date: lossesData.Date?.toDate().toLocaleDateString(),
          };
        });
        setDataToExport(data);

        const groupedData = data.reduce((acc, losses) => {
          if (!acc[losses.Name]) {
            acc[losses.Name] = [];
          }
          acc[losses.Name].push(losses);
          return acc;
        }, []);

        const groupedArray = sortArray(Object.values(groupedData), 'Manufacturer', 'asc', ['Quantity', 'ManufacturerPrice']);

        setLosses(groupedArray);
         // Cache the fetched losses data in session storage
         sessionStorage.setItem('cachedLosses', JSON.stringify(groupedArray));
      });

      return () => unsubscribe();
    }
  }, [startDate, endDate]);

  const getTotalLosses = (group) => {
    return group.reduce((total, losses) => total + losses.Quantity * losses.ManufacturerPrice, 0);
  };

  const calculateTotalLoss = (group) => {
    return group.reduce((total, losses) => total + losses.ManufacturerPrice * losses.Quantity, 0);
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
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            sx={{ marginLeft: '10px' }}
          />
          <Typography variant="body2">עד</Typography>
          <TextField
            type="date"
            label="מתאריך"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
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
              <TableCell>סה"כ </TableCell>
              <TableCell>כמות</TableCell>
              <TableCell>מחיר יצרן</TableCell>
              <TableCell>יצרן</TableCell>
              <TableCell>תאריך </TableCell>
              <TableCell>שם מוצר</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {losses.length > 0 ? (
              losses.map((group, index) => (
                group.map((losses, rowIndex) => (
                  <TableRow key={losses.id}>
                    {rowIndex === 0 && (
                      <TableCell rowSpan={group.length} sx={{ fontWeight: 'bold', color: 'blue' }}>
                        {+getTotalLosses(group)}
                      </TableCell>
                    )}
                    <TableCell>{losses.Quantity} </TableCell>
                    <TableCell>{losses.ManufacturerPrice} ₪</TableCell>
                    <TableCell>{losses.Manufacturer}</TableCell>
                    <TableCell>{losses.Date}</TableCell>
                    <TableCell>{losses.Name}</TableCell>
                  </TableRow>
                ))
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>מחפש...</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      {losses.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            סך ההפסדים הכולל:
          </Typography>
          <Typography variant="h6">
            {losses.reduce((total, group) => total + calculateTotalLoss(group), 0)} ₪
          </Typography>
        </Box>
      )}
      <ExportExcel data={dataToExport} filename="טבלת הפסדים" disabled={dataToExport.length === 0} />
    </Box>
  );
}
