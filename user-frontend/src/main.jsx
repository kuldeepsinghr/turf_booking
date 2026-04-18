import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { TurfProvider } from './context/TurfContext.jsx';
import AuthProvider from './context/AuthContext.jsx';
import BookingProvider from "./context/BookingContext";
// test the 

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <TurfProvider>
    <BookingProvider>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
    </BookingProvider>
  </TurfProvider>,
  </AuthProvider>
)

