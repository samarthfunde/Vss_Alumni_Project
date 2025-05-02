/*import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  useEffect(() => {
    const user = localStorage.getItem('user_type');
    if (user === 'admin') {
      setIsAdmin(true);
      setIsLoggedIn(true);
    } else if (user === 'alumnus') {
      setIsAdmin(false);
      setIsLoggedIn(true);
    } else {
      setIsAdmin(false);
      setIsLoggedIn(false);
    }
  }, [login]);



  return (
    <AuthContext.Provider value={{ isAdmin, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};*/ 
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAlumnus, setIsAlumnus] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
 //onst [userId, setUserId] = useState(null);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsAlumnus(false);
    setIsStudent(false);  
    setUserId(null);
   //ocalStorage.removeItem('user_id');
    localStorage.removeItem('user_type'); // Optional: clear user type on logout
  };

  useEffect(() => {
    const user = localStorage.getItem('user_type');  
   //onst storedUserId = localStorage.getItem('user_id'); 
   /*f (storedUserId) {
      setUserId(storedUserId);
    }*/
  
    if (user === 'admin') {
      setIsAdmin(true);
      setIsAlumnus(false);
      setIsStudent(false);
      setIsLoggedIn(true);
    } else if (user === 'alumnus') {
      setIsAdmin(false);
      setIsAlumnus(true);
      setIsStudent(false);
      setIsLoggedIn(true);
    } else if (user === 'student') {
      setIsAdmin(false);
      setIsAlumnus(false);
      setIsStudent(true);
      setIsLoggedIn(true);
    } else {
      setIsAdmin(false);
      setIsAlumnus(false);
      setIsStudent(false);
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        isAlumnus,
        isStudent,
        isLoggedIn,
        login, 
       //serId,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

