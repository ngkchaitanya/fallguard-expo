import React, { useContext, useEffect } from 'react';
import { FirebaseProvider } from './src/contexts/FirebaseContext';
import Index from './src/Index';
import { AuthProvider } from './src/contexts/AuthContext';


export default function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <Index />
      </AuthProvider>
    </FirebaseProvider>
  );
}
