import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext.tsx'

// Mount React
createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);

// Remove the preloader once React is ready
const preloader = document.getElementById("preloader");
if (preloader) {
  preloader.style.opacity = "0"; // fade out
  setTimeout(() => preloader.remove(), 300); // remove after fade
}
