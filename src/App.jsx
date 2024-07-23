import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { query, collection, onSnapshot } from 'firebase/firestore';
import db from './firebase';
import NavBar from './NavBar';

// Use React.lazy for dynamic imports
const HomePage = lazy(() => import('./HomePage'));
const Payment = lazy(() => import('./PaymentPage'));
const ViewInventory = lazy(() => import('./InformationTablesPage'));
const UpdateInventory = lazy(() => import('./UpdateInventoryPage'));
const PayToSupPage = lazy(() => import('./PayToSupPage'));
const UpdatedProducts = lazy(() => import('./UpdateProductsPage'));
const UserManagement = lazy(() => import('./UserManagementPage'));
const StatisticsPage = lazy(() => import('./StatisticsPage'));
const DealsPage = lazy(() => import('./DealsPage'));
const NotFound = lazy(() => import('./NotFound'));

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
    <div style={{ width: '80vw', marginLeft: '10vw', marginRight: '10vw' }}>
      <NavBar />
      {/* Use Suspense to wrap lazy-loaded routes */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes basename="/">
          <Route path="/" element={<HomePage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/view" element={<ViewInventory />} />
          <Route path="/update" element={<UpdateInventory />} />
          <Route path="/updateprod" element={<UpdatedProducts />} />
          <Route path="/PayToSupPage" element={<PayToSupPage />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/deals" element={<DealsPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
