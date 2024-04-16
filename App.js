import React, { useContext, useEffect } from 'react';
import { FirebaseProvider } from './src/contexts/FirebaseContext';
import Index from './src/Index';
import { AuthProvider } from './src/contexts/AuthContext';
import Toast, { BaseToast, ErrorToast, SuccessToast } from 'react-native-toast-message';
import { StyleSheet } from 'react-native';
import { FallProvider } from './src/contexts/FallContext';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';

const toastConfig = {
  success: (props) => (
    <SuccessToast
      {...props}
      // style={styles.style}
      // contentContainerStyle={styles.contentContainerStyle}
      // text1Style={styles.text1Style}
      text1NumberOfLines={2}
      // text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      // style={styles.style}
      // contentContainerStyle={styles.contentContainerStyle}
      // text1Style={styles.text1Style}
      text1NumberOfLines={2}
      // text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      // style={[styles.style, styles.errorStyle]}
      // contentContainerStyle={styles.contentContainerStyle}
      // text1Style={styles.text1Style}
      text1NumberOfLines={2}
      // text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
};

// @TODO: include theme here
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

export default function App() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <FallProvider>
          <PaperProvider theme={theme}>
            <Index />
            <Toast config={toastConfig} />
          </PaperProvider>
        </FallProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}
