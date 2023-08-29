import React, { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import db from './firebase';
import App from './App';

const LogIn = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  

  const cachedUserRole = sessionStorage.getItem('userRole'); // Get cached user role

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser(userData);

          // Cache user role
          sessionStorage.setItem('userRole', userData.role);
        } else {
          setUser(null);
          sessionStorage.removeItem('userRole'); // Clear cached user role
          await auth.signOut();
        }
      } else {
        setUser(null);
        sessionStorage.removeItem('userRole'); // Clear cached user role
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    if (cachedUserRole) {
      setUserRole(cachedUserRole);
    }
  }, [cachedUserRole]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { email } = result.user;
      const userDocRef = doc(firestore, 'users', email);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert('אתה לא מורשה להכנס לאתר');
        setUser(null);
        setUserRole(null); // Clear user role
        sessionStorage.removeItem('userRole'); // Clear cached user role
        await auth.signOut();
      } else {
        const userData = userDocSnap.data();
        setUser(userData);
        setUserRole(userData.role);
        sessionStorage.setItem('userRole', userData.role); // Cache user role
        sessionStorage.setItem('userEmail', userData.email); // Cache user role
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', width:'100vw' }}>בטעינה...</div>;
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' ,width:'80vw' ,marginLeft:'10vw', marginRight:'10vw'}}>
      {user ? (
        <div>
          <App userRole={userRole}  />
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2>יש להתחבר כדי להכנס לאתר</h2>
          <button onClick={handleSignIn}>כניסה באמצעות חשבון גוגל</button>
        </div>
      )}
    </div>
  );
};

export default LogIn;
