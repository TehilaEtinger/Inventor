import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc,addDoc, Timestamp,getDoc } from 'firebase/firestore';
import db from '../firebase';
import SupplierRow from './SupplierRow';
import ConfirmationDialog from './ConfirmationDialog';

const AccountsPayable = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [sum, setSum] = useState(0)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'suppliers'), (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSuppliers(data);
    });

    return () => unsubscribe();
  }, []);

  const addSupplierPaymentRecord = async (paymentDetails) => {
    try {
      // Add the payment details object to the 'supplierPayments' collection
      const paymentRef = await addDoc(collection(db, 'supplierPayments'), paymentDetails);
      console.log('Payment record added with ID:', paymentRef.id);
    } catch (error) {
      console.error('Error adding payment record:', error);
      // You can handle the error or provide appropriate feedback to the user
    }
  };

  const handlePayment = async ({supplierId, sum}) => {
    // Show confirmation dialog before resetting the supplier's debt to 0
    setSelectedSupplierId(supplierId);
    setSum(sum)
    setShowConfirmation(true);
  };

  const handlePartialPayment = async (supplierId, amountPaid) => {
    setSum(amountPaid)
    try {
      const supplierDocRef = doc(db, 'suppliers', supplierId);
      const supplierDoc = await supplierDocRef.get();

      if (supplierDoc.exists()) {
        const currentDebt = supplierDoc.data().totalDebt;

        // Ensure that the partial payment is within valid bounds
        if (amountPaid >= 1 && amountPaid <= currentDebt) {
          
          const updatedDebt = currentDebt - amountPaid;
          await updateDoc(supplierDocRef, { totalDebt: updatedDebt });
          
          const paymentDetails = {
            supplier: supplierDoc.data().name,
            date: Timestamp.now(),
            sum: sum 
            // Add any other payment details you need
          };
    
          // Add the payment record to the supplierPayments collection
          await addSupplierPaymentRecord(paymentDetails);

          console.log('Supplier debt updated successfully.');
        } else {
          console.error('Invalid partial payment amount.');
        }
      } else {
        console.error('Supplier document not found in Firestore.');
      }
    } catch (error) {
      console.error('Error updating supplier debt:', error);
    }
  };

  const getSupplierDoc = async (supplierDocRef) => {
    return await getDoc(supplierDocRef);
  };
  
  
  const handleConfirmationOk = async () => {
    if (selectedSupplierId) {
      try {
        // Reset the supplier's debt to 0
        await updateDoc(doc(db, 'suppliers', selectedSupplierId), { totalDebt: 0 });
  
        // Fetch supplier document
        const supplierDocRef = doc(db, 'suppliers', selectedSupplierId);
        const supplierDoc = await getSupplierDoc(supplierDocRef);
  
        // Create the payment details object
        const paymentDetails = {
          supplier: supplierDoc.data().name,
          date: Timestamp.now(),
          sum: sum 
          // Add any other payment details you need
        };
  
        // Add the payment record to the supplierPayments collection
        await addSupplierPaymentRecord(paymentDetails);
  
        console.log('Supplier debt reset successfully.');
      } catch (error) {
        console.error('Error resetting supplier debt:', error);
      }
    }
  
    // Close the confirmation dialog
    setShowConfirmation(false);
    setSelectedSupplierId(null);
  };

  const handleConfirmationCancel = () => {
    // Close the confirmation dialog without resetting the debt
    setShowConfirmation(false);
    setSelectedSupplierId(null);
  };

  return (
    <div>
      <h2>תשלומי ספקים</h2>
      <table>
        <thead>
          <tr>
            <th>תשלום חוב חלקי</th>
            <th>תשלום חוב</th>
            <th>חוב</th>
            <th>ספק</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <SupplierRow
              key={supplier.id}
              supplier={supplier}
              onPayment={handlePayment}
              onPartialPayment={handlePartialPayment}
            />
          ))}
        </tbody>
      </table>
      <ConfirmationDialog
        open={showConfirmation}
        onOk={handleConfirmationOk}
        onCancel={handleConfirmationCancel}
        title="אישור תשלום חוב"
        message="האם אתה בטוח שהחוב לספק שולם במלואו?"
      />
    </div>
  );
};

export default AccountsPayable;
