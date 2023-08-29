import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { query, collection, onSnapshot } from 'firebase/firestore';
import db from './firebase';
import HomePage from './HomePage';
import NavBar from './NavBar';
import Payment from './PaymentPage';
import ViewInventory from './InformationTablesPage'
import UpdateInventory from './UpdateInventoryPage'
import PayToSupPage from './PayToSupPage';
import UpdatedProducts from './UpdateProductsPage';
import UserManagement from './UserManagementPage';
import StatisticsPage from './StatisticsPage';
import DealsPage from './DealsPage';
import NotFound from './NotFound';

function App({ userRole }) {
  const dispatch = useDispatch();

  const getAll = async () => {
    try {
      // Check if stock data exists in session storage
      const cachedStockData = sessionStorage.getItem('stockData');
      if (cachedStockData) {
        const parsedData = JSON.parse(cachedStockData);
        dispatch({ type: 'SET_PRODUCTS', payload: parsedData });
      } else {
        // Fetch stock data from the database
        const q = query(collection(db, 'stock'));
        onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });

          // Store stock data in session storage
          sessionStorage.setItem('stockData', JSON.stringify(data));

          dispatch({ type: 'SET_PRODUCTS', payload: data });
        });
      }
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  useEffect(() => {
    getAll();
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const checkAuthorization = (requiredRole) => {
    return userRole === requiredRole ? true : false;
  };


  return (
    <div >
      <NavBar />

      <Routes basename="/">
        <Route path="/" element={<HomePage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />

        {/* Authorized routes */}
        {checkAuthorization('admin') && (
          <>
            {/* Render the admin-only routes */}
            <Route path="/view" element={<ViewInventory />} />
            <Route path="/update" element={<UpdateInventory />} />
            <Route path="/updateprod" element={<UpdatedProducts />} />
            <Route path="/PayToSupPage" element={<PayToSupPage />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/deals" element={<DealsPage />} />
            
            
          </>
        )}

        {/* Default route for unauthorized users */}
        {!checkAuthorization('admin') && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
