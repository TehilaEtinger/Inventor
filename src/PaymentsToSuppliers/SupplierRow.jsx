import PaymentModal from './PaymentModal';
import { doc, updateDoc, getDoc,Timestamp,addDoc,collection } from "firebase/firestore";
import db from '../firebase';

const SupplierRow = ({ supplier, onPayment, onPartialPayment }) => {
  const handlePayment = () => {
    
    // Call the onPayment function with the supplier ID to reset the debt
    onPayment({supplierId:supplier.id, sum:supplier.totalDebt});
  };
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

  const handlePartialPayment = async (amountPaid) => {
    try {
      const supplierDocRef = doc(db, 'suppliers', supplier.id);
      const supplierDocSnap = await getDoc(supplierDocRef);

      if (supplierDocSnap.exists()) {
        const currentDebt = supplierDocSnap.data().totalDebt;

        // Ensure that the partial payment is within valid bounds
        if (amountPaid >= 1 && amountPaid <= currentDebt) {
          const updatedDebt = currentDebt - amountPaid;
          await updateDoc(supplierDocRef, { totalDebt: updatedDebt });
          const paymentDetails = {
            supplier: supplier.name,
            date: Timestamp.now(),
            sum: amountPaid 
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

  return (
    <tr>
      <td>
        <PaymentModal onPartialPayment={handlePartialPayment} debt={ supplier.totalDebt}/>
      </td>
      <td>
        <button onClick={handlePayment} disabled={supplier.totalDebt === 0}>שולם</button>
      </td>
      <td>{supplier.totalDebt}</td>
      <td>{supplier.name}</td>
    </tr>
  );
};

export default SupplierRow;
