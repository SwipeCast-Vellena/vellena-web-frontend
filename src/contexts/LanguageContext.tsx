import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  it: {
    // Splash Screen
    'splash.title': 'yo_work',
    
    // Walkthrough
    'walkthrough.welcome.title': 'Benvenuto su yo_work',
    'walkthrough.welcome.description': 'La piattaforma che connette modelli, hostess e agenzie attraverso presentazioni video professionali.',
    'walkthrough.profile.title': 'Crea il tuo Profilo Video',
    'walkthrough.profile.description': 'Registra un video di presentazione di 30 secondi per mostrare la tua personalità e le tue competenze professionali.',
    'walkthrough.discover.title': 'Scopri Nuovi Talenti',
    'walkthrough.discover.description': 'Scorri i profili, guarda i video di presentazione e trova i professionisti perfetti per i tuoi progetti.',
    'walkthrough.connect.title': 'Connetti e Collabora',
    'walkthrough.connect.description': 'Quando c\'è un match, inizia a chattare e organizza collaborazioni professionali di successo.',
    'walkthrough.verified.title': 'Solo Professionisti Verificati',
    'walkthrough.verified.description': 'Tutti gli utenti sono verificati per garantire un ambiente sicuro e professionale per le tue collaborazioni.',
    'walkthrough.skip': 'Salta',
    'walkthrough.next': 'Avanti',
    'walkthrough.start': 'Inizia',
    
    // Onboarding
    'onboarding.title': 'Benvenuto su yo_work',
    'onboarding.subtitle': 'La piattaforma professionale che connette modelli, hostess e agenzie di marketing attraverso presentazioni video.',
    'onboarding.feature1.title': 'Profili Video',
    'onboarding.feature1.description': 'Video professionali di presentazione da 30 secondi',
    'onboarding.feature2.title': 'Matching Intelligente',
    'onboarding.feature2.description': 'Connetti agenzie e talenti in modo efficiente',
    'onboarding.feature3.title': 'Professionisti Verificati',
    'onboarding.feature3.description': 'Tutti gli utenti verificati solo per scopi professionali',
    'onboarding.startNow': 'Inizia Ora',
    'onboarding.haveAccount': 'Ho Già un Account',
    'onboarding.terms': 'yo_work è esclusivamente per scopi professionali. Continuando, accetti i nostri Termini di Servizio e l\'Informativa sulla Privacy.',
    
    // Auth
    'auth.signUp': 'Registrati',
    'auth.login': 'Accedi',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Password dimenticata?',
    'auth.noAccount': 'Non hai un account?',
    'auth.haveAccount': 'Hai già un account?',
    'auth.signUpHere': 'Registrati qui',
    'auth.loginHere': 'Accedi qui',
    
    // Profile Creation
    'profile.title': 'Crea il Tuo Profilo',
    'profile.subtitle': 'Iniziamo con le informazioni di base',
    'profile.name': 'Nome completo',
    'profile.age': 'Età',
    'profile.location': 'Città',
    'profile.role': 'Ruolo',
    'profile.bio': 'Biografia',
    'profile.role.model': 'Modello',
    'profile.role.hostess': 'Hostess',
    'profile.role.agency': 'Agenzia',
    'profile.role.photographer': 'Fotografo',
    'profile.role.other': 'Altro',
    'profile.continue': 'Continua',
    
    // Main Feed
    'feed.title': 'Scopri',
    'feed.noMore': 'Non ci sono più profili da mostrare!',
    'feed.location': 'da',
    'feed.viewProfile': 'Visualizza Profilo',
    
    // Search
    'search.title': 'Cerca',
    'search.placeholder': 'Cerca per nome, ruolo o città...',
    'search.recent': 'Ricerche recenti',
    'search.noResults': 'Nessun risultato trovato',
    'search.tryDifferent': 'Prova termini di ricerca diversi',
    
    // User Detail
    'userDetail.about': 'Informazioni',
    'userDetail.gallery': 'Galleria',
    'userDetail.contact': 'Contatta',
    'userDetail.pass': 'Passa',
    'userDetail.like': 'Mi Piace',
    
    // Match Confirmation
    'match.title': 'È un Match!',
    'match.subtitle': 'Fantastico! A entrambi piacete. Inizia una conversazione ora.',
    'match.sendMessage': 'Invia un Messaggio',
    'match.keepSwiping': 'Continua a Scorrere',
    
    // Chat
    'chat.title': 'Chat',
    'chat.typeMessage': 'Scrivi un messaggio...',
    'chat.send': 'Invia',
    'chat.noChats': 'Nessuna chat ancora',
    'chat.startMatching': 'Inizia a fare match per vedere le tue conversazioni qui!',
    
    // Campaigns
    'campaigns.title': 'Campagne',
    'campaigns.active': 'Attive',
    'campaigns.completed': 'Completate',
    'campaigns.create': 'Crea Campagna',
    'campaigns.noActive': 'Nessuna campagna attiva',
    'campaigns.startCreating': 'Inizia a creare campagne per gestire i tuoi progetti!',
    'campaigns.details': 'Dettagli Campagna',
    'campaigns.participants': 'Partecipanti',
    'campaigns.status': 'Stato',
    'campaigns.budget': 'Budget',
    'campaigns.deadline': 'Scadenza',
    'campaigns.apply': 'Candidati',
    'campaigns.edit': 'Modifica',
    'campaigns.name': 'Nome Campagna',
    'campaigns.description': 'Descrizione',
    'campaigns.requirements': 'Requisiti',
    'campaigns.save': 'Salva Campagna',
    
    // Profile Settings
    'settings.title': 'Impostazioni Profilo',
    'settings.editProfile': 'Modifica Profilo',
    'settings.changePhoto': 'Cambia Foto',
    'settings.preferences': 'Preferenze',
    'settings.notifications': 'Notifiche',
    'settings.privacy': 'Privacy',
    'settings.help': 'Aiuto',
    'settings.logout': 'Logout',
    'settings.save': 'Salva Modifiche',
    
    // Navigation
    'nav.feed': 'Feed',
    'nav.search': 'Cerca',
    'nav.campaigns': 'Campagne',
    'nav.chat': 'Chat',
    'nav.profile': 'Profilo',
    
    // Language
    'language.select': 'Seleziona Lingua',
    'language.italian': 'Italiano',
    'language.english': 'English'
  },
  en: {
    // Splash Screen
    'splash.title': 'yo_work',
    
    // Walkthrough
    'walkthrough.welcome.title': 'Welcome to yo_work',
    'walkthrough.welcome.description': 'The platform that connects models, hostesses and agencies through professional video presentations.',
    'walkthrough.profile.title': 'Create Your Video Profile',
    'walkthrough.profile.description': 'Record a 30-second presentation video to showcase your personality and professional skills.',
    'walkthrough.discover.title': 'Discover New Talents',
    'walkthrough.discover.description': 'Swipe through profiles, watch presentation videos and find the perfect professionals for your projects.',
    'walkthrough.connect.title': 'Connect and Collaborate',
    'walkthrough.connect.description': 'When there\'s a match, start chatting and organize successful professional collaborations.',
    'walkthrough.verified.title': 'Verified Professionals Only',
    'walkthrough.verified.description': 'All users are verified to ensure a safe and professional environment for your collaborations.',
    'walkthrough.skip': 'Skip',
    'walkthrough.next': 'Next',
    'walkthrough.start': 'Start',
    
    // Onboarding
    'onboarding.title': 'Welcome to yo_work',
    'onboarding.subtitle': 'The professional platform that connects models, hostesses and marketing agencies through video presentations.',
    'onboarding.feature1.title': 'Video Profiles',
    'onboarding.feature1.description': '30-second professional presentation videos',
    'onboarding.feature2.title': 'Smart Matching',
    'onboarding.feature2.description': 'Connect agencies and talents efficiently',
    'onboarding.feature3.title': 'Verified Professionals',
    'onboarding.feature3.description': 'All users verified for professional purposes only',
    'onboarding.startNow': 'Start Now',
    'onboarding.haveAccount': 'I Already Have an Account',
    'onboarding.terms': 'yo_work is exclusively for professional purposes. By continuing, you agree to our Terms of Service and Privacy Policy.',
    
    // Auth
    'auth.signUp': 'Sign Up',
    'auth.login': 'Login',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.haveAccount': 'Already have an account?',
    'auth.signUpHere': 'Sign up here',
    'auth.loginHere': 'Login here',
    
    // Profile Creation
    'profile.title': 'Create Your Profile',
    'profile.subtitle': 'Let\'s start with basic information',
    'profile.name': 'Full name',
    'profile.age': 'Age',
    'profile.location': 'City',
    'profile.role': 'Role',
    'profile.bio': 'Biography',
    'profile.role.model': 'Model',
    'profile.role.hostess': 'Hostess',
    'profile.role.agency': 'Agency',
    'profile.role.photographer': 'Photographer',
    'profile.role.other': 'Other',
    'profile.continue': 'Continue',
    
    // Main Feed
    'feed.title': 'Discover',
    'feed.noMore': 'No more profiles to show!',
    'feed.location': 'from',
    'feed.viewProfile': 'View Profile',
    
    // Search
    'search.title': 'Search',
    'search.placeholder': 'Search by name, role or city...',
    'search.recent': 'Recent searches',
    'search.noResults': 'No results found',
    'search.tryDifferent': 'Try different search terms',
    
    // User Detail
    'userDetail.about': 'About',
    'userDetail.gallery': 'Gallery',
    'userDetail.contact': 'Contact',
    'userDetail.pass': 'Pass',
    'userDetail.like': 'Like',
    
    // Match Confirmation
    'match.title': 'It\'s a Match!',
    'match.subtitle': 'Great! You both like each other. Start a conversation now.',
    'match.sendMessage': 'Send a Message',
    'match.keepSwiping': 'Keep Swiping',
    
    // Chat
    'chat.title': 'Chat',
    'chat.typeMessage': 'Type a message...',
    'chat.send': 'Send',
    'chat.noChats': 'No chats yet',
    'chat.startMatching': 'Start matching to see your conversations here!',
    
    // Campaigns
    'campaigns.title': 'Campaigns',
    'campaigns.active': 'Active',
    'campaigns.completed': 'Completed',
    'campaigns.create': 'Create Campaign',
    'campaigns.noActive': 'No active campaigns',
    'campaigns.startCreating': 'Start creating campaigns to manage your projects!',
    'campaigns.details': 'Campaign Details',
    'campaigns.participants': 'Participants',
    'campaigns.status': 'Status',
    'campaigns.budget': 'Budget',
    'campaigns.deadline': 'Deadline',
    'campaigns.apply': 'Apply',
    'campaigns.edit': 'Edit',
    'campaigns.name': 'Campaign Name',
    'campaigns.description': 'Description',
    'campaigns.requirements': 'Requirements',
    'campaigns.save': 'Save Campaign',
    
    // Profile Settings
    'settings.title': 'Profile Settings',
    'settings.editProfile': 'Edit Profile',
    'settings.changePhoto': 'Change Photo',
    'settings.preferences': 'Preferences',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.help': 'Help',
    'settings.logout': 'Logout',
    'settings.save': 'Save Changes',
    
    // Navigation
    'nav.feed': 'Feed',
    'nav.search': 'Search',
    'nav.campaigns': 'Campaigns',
    'nav.chat': 'Chat',
    'nav.profile': 'Profile',
    
    // Language
    'language.select': 'Select Language',
    'language.italian': 'Italiano',
    'language.english': 'English'
  }
};