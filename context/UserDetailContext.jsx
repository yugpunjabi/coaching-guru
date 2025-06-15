import React, { createContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export const UserDetailContext = createContext();

export const UserDetailProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true); // optional but helpful

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetail({
          email: user.email,
          uid: user.uid,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        });
      } else {
        setUserDetail(null);
      }
      setLoading(false); // done checking
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ userDetail, loading }}>
      {children}
    </UserDetailContext.Provider>
  );
};
