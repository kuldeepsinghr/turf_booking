import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { TurfProvider } from "./context/TurfContext.jsx";
import { SlotProvider } from "./context/SlotContext.jsx";

createRoot(document.getElementById('root')).render(
  <TurfProvider>
    <SlotProvider>

      <BrowserRouter>
    <App />
  </BrowserRouter>
    </SlotProvider>
  </TurfProvider>
)
