import React, { useState, useEffect } from 'react';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import App from './App';

const LogIn = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isCustomer, setIsCustomer] = useState(true);

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
          setUserRole(userData.role);
          sessionStorage.setItem('userRole', userData.role);
          setIsCustomer(true); // User is a customer
        } else {
          const guestUser = {
            email: user.email,
            role: 'admin', // Assign admin role to guest user
          };
          setUser(guestUser);
          setUserRole('admin');
          sessionStorage.setItem('userRole', 'admin');
          setIsCustomer(false); // User is not a customer
          // Show toast notification for guest user
          toast.info(
            <div style={{ textAlign: 'right' }}>
              <span>הי 👋</span>
              <span style={{ display: 'block' }}>שמנו לב שאתה עדיין לא לקוח של BizFlow.</span>
              <span style={{ display: 'block' }}>לכן נציג לך נתוני דמה כך שתוכל להתרשם מהאתר</span>
            </div>,
            {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        }
        sessionStorage.setItem('userEmail', user.email);
      } else {
        setUser(null);
        sessionStorage.removeItem('userRole'); // Clear cached user role
        setIsCustomer(true); // Reset to default
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
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const { email } = result.user;
      const userDocRef = doc(firestore, 'users', email);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUser(userData);
        setUserRole(userData.role);
        sessionStorage.setItem('userRole', userData.role);
        setIsCustomer(true); // User is a customer
      } else {
        const guestUser = {
          email: email,
          role: 'admin', // Assign admin role to guest user
        };
        setUser(guestUser);
        setUserRole('admin');
        sessionStorage.setItem('userRole', 'admin');
        setIsCustomer(false); // User is not a customer
        // Show toast notification for guest user
     
      }
      sessionStorage.setItem('userEmail', email);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const openGmailWindow = () => {
    const mailtoLink = "https://mail.google.com/mail/?view=cm&fs=1&to=tehilla4468@gmail.com&su=Inquiry%20from%20Website&body=Hello%2C%20I%20would%20like%20to%20...";
    window.open(mailtoLink, '_blank', 'noopener,noreferrer');
  };

  const openWhatsApp = () => {
    const whatsappLink = "https://wa.me/0559763244?text=Hello%20I%20would%20like%20to%20...";
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  const openGitHub = () => {
    window.open("https://github.com/TehilaEtinger", '_blank', 'noopener,noreferrer');
  };

  const openLinkedIn = () => {
    window.open("https://www.linkedin.com/in/tehila-etinger/", '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', width: '100vw' }}>בטעינה...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '80vw', marginLeft: '10vw', marginRight: '10vw', minHeight: '100vh' }}>
      <ToastContainer />
      {user ? (
        <div>
          <App userRole={userRole} dummyData={!isCustomer} />
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2>יש להתחבר כדי להכנס לאתר</h2>
          <button onClick={handleSignIn}>כניסה באמצעות חשבון גוגל</button>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
        <button onClick={openGmailWindow} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className="fas fa-envelope" style={{ fontSize: '24px', color: '#ea4335' }}></i>
        </button>
        <button onClick={openWhatsApp} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className="fab fa-whatsapp" style={{ fontSize: '24px', color: '#25D366' }}></i>
        </button>
        <button onClick={openGitHub} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className="fab fa-github" style={{ fontSize: '24px', color: '#333' }}></i>
        </button>
        <button onClick={openLinkedIn} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <i className="fab fa-linkedin" style={{ fontSize: '24px', color: '#0077b5' }}></i>
        </button>
      </div>
        </div>
      )}
      
      
    </div>
  );
};

export default LogIn;
