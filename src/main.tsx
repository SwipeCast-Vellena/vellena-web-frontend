import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext.tsx'

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);


/*import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import AuthScreen from './components/AuthScreen.tsx';

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <AuthScreen 
      isLogin={false} 
      onBack={() => console.log("Back pressed")} 
      onSuccess={() => console.log("Login success")} 
    />
  </LanguageProvider>
);*/
