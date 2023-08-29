import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import ExportExcel from './ExportExcel';
import { sortArray } from './tableUtils'; // Import the sortArray utility function

export default function StockTable() {
  const stock = useSelector((state) => state.stock);
  const [sorting, setSorting] = useState({
    column: '',
    order: 'asc',
  });

  // Function to toggle sorting
  const toggleSorting = (column) => {
    if (sorting.column === column) {
      setSorting({ ...sorting, order: sorting.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSorting({ column, order: 'asc' });
    }
  };

  // Sort the stock array by the specified column and order using the utility function
  const sortedStock = sortArray(stock, sorting.column, sorting.order, ['CustomerPrice', 'ManufacturerPrice']);
    
  return (
    <Box>
      {/* Table for Stock */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell
                onClick={() => toggleSorting('Quantity')}
                sx={{ cursor: 'pointer', backgroundColor: sorting.column === 'Quantity' ? '#f0f8ff' : 'transparent' }}
              >
                כמות
                {sorting.column === 'Quantity' && (
                  <span>{sorting.order === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableCell>
              <TableCell
                onClick={() => toggleSorting('CustomerPrice')}
                sx={{ cursor: 'pointer', backgroundColor: sorting.column === 'CustomerPrice' ? '#f0f8ff' : 'transparent' }}
              >
                מחיר לצרכן
                {sorting.column === 'CustomerPrice' && (
                  <span>{sorting.order === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableCell>
              <TableCell
                onClick={() => toggleSorting('ManufacturerPrice')}
                sx={{ cursor: 'pointer', backgroundColor: sorting.column === 'ManufacturerPrice' ? '#f0f8ff' : 'transparent' }}
              >
                מחיר יצרן
                {sorting.column === 'ManufacturerPrice' && (
                  <span>{sorting.order === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableCell>
              <TableCell
                onClick={() => toggleSorting('Manufacturer')}
                sx={{ cursor: 'pointer', backgroundColor: sorting.column === 'Manufacturer' ? '#f0f8ff' : 'transparent' }}
              >
                יצרן
                {sorting.column === 'Manufacturer' && (
                  <span>{sorting.order === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableCell>
              <TableCell
                onClick={() => toggleSorting('Name')}
                sx={{ cursor: 'pointer', backgroundColor: sorting.column === 'Name' ? '#f0f8ff' : 'transparent' }}
              >
                שם מוצר
                {sorting.column === 'Name' && (
                  <span>{sorting.order === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStock.map((product) => (
              <TableRow key={product.id}>
                <TableCell fontWeight="bold" color="blue" sx={{ backgroundColor: '#f0f8ff' }}>
                  {product.Quantity}
                </TableCell>
                <TableCell>{product.CustomerPrice}₪</TableCell>
                <TableCell>{product.ManufacturerPrice}₪</TableCell>
                <TableCell>{product.Manufacturer}</TableCell>
                <TableCell fontWeight="bold" color="#008000">
                  {product.Name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <ExportExcel data={stock} filename="טבלת מלאי" />
    </Box>
  );
}
