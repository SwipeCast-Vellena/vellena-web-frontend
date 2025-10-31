# 🎬 Yo.Works Frontend

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)

**A modern, professional platform connecting models, hostesses, and marketing agencies through video-presentation profiles and intelligent campaign matching.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Key Screens](#-key-screens)
- [Architecture Highlights](#-architecture-highlights)
- [Development Guide](#-development-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Yo.Works** is a comprehensive talent-matching platform designed to revolutionize how marketing agencies connect with professional models, hostesses, and photographers. The platform emphasizes video-first profiles, real-time communication, and intelligent matching algorithms to facilitate seamless professional collaborations.

### Key Highlights

- 🎥 **Video-First Profiles**: 30-second professional presentation videos
- 🤝 **Smart Matching**: AI-driven matching between agencies and talents
- 💬 **Real-Time Chat**: Firebase-powered messaging system
- 🌐 **Multilingual Support**: Full internationalization (i18n) for Italian and English
- 📱 **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS
- ⚡ **Performance**: Optimized with Vite, React 18, and advanced memoization

---

## ✨ Features

### 🔐 Authentication & Onboarding
- **Dual Role System**: Separate registration flows for Models/Hostesses and Agencies
- **Walkthrough Experience**: Interactive onboarding with feature highlights
- **Secure Authentication**: JWT-based authentication with persistent sessions
- **Profile Creation Wizards**: Guided profile setup for both user types

### 👥 Model Features
- **Video Portfolio**: Upload and showcase 30-second professional videos
- **Photo Gallery**: Multiple photo uploads with drag-and-drop interface
- **Campaign Discovery**: Browse and apply to available campaigns
- **Match System**: View and manage agency matches
- **Profile Completeness Tracker**: Visual progress indicator
- **Swipe Interface**: Tinder-like discovery experience

### 🏢 Agency Features
- **Campaign Management**: Create, edit, and manage marketing campaigns
- **Talent Search**: Advanced search with filters (category, location, gender)
- **Model Discovery**: Swipe through model profiles with video previews
- **Chat System**: Professional communication with matched talents
- **Application Review**: Review and approve model applications
- **Analytics Dashboard**: Track campaign performance and applicants

### 💬 Communication
- **Real-Time Chat**: Firebase-powered messaging
- **Professional Chat Guidelines**: Enforced professional communication
- **Message History**: Persistent chat history with timestamps
- **Notification System**: Real-time updates for matches and messages

### 🌍 Internationalization
- **Full i18n Support**: Complete translation system for Italian and English
- **Dynamic Language Switching**: Real-time language context updates
- **RTL-Ready**: Prepared for right-to-left languages

---

## 🛠 Tech Stack

### Core Framework
- **React 18.3** - Latest React with concurrent features
- **TypeScript 5.5** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool with SWC compiler
- **React Router DOM 6.26** - Client-side routing

### State Management
- **Zustand 5.0** - Lightweight, performant state management
- **TanStack Query 5.56** - Powerful data synchronization for server state
- **React Context API** - Language and theme management

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - 75+ accessible component library (Radix UI primitives)
- **Class Variance Authority** - Type-safe component variants
- **Lucide React** - Beautiful, consistent icon system
- **Embla Carousel** - Accessible carousel component

### Forms & Validation
- **React Hook Form 7.53** - Performant form handling
- **Zod 3.23** - Schema validation with TypeScript inference
- **@hookform/resolvers** - Zod integration

### Utilities
- **date-fns 3.6** - Date manipulation and formatting
- **axios 1.12** - HTTP client for API requests
- **sonner** - Toast notifications
- **Socket.io-client 4.8** - Real-time WebSocket communication

### Payment Integration
- **@stripe/stripe-js 7.9** - Stripe payment processing

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vellena-web-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

---

## 📁 Project Structure

```
vellena-web-frontend/
├── public/                      # Static assets
│   ├── YOWORKS LOGO.png        # Brand assets
│   └── YO.WORKS ICON.png
├── src/
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── AuthScreen.tsx      # Authentication UI
│   │   ├── CampaignCreationScreen.tsx
│   │   ├── CampaignDetailScreen.tsx
│   │   ├── ChatScreen.tsx      # Real-time chat
│   │   ├── MainFeedScreenModel.tsx
│   │   ├── MainFeedScreenAgency.tsx
│   │   ├── ProfileCreationScreenModel.tsx
│   │   ├── ProfileCreationScreenAgency.tsx
│   │   ├── SearchScreen.tsx
│   │   └── ...
│   ├── contexts/               # React contexts
│   │   └── LanguageContext.tsx # i18n implementation
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route wrappers
│   │   └── Index.tsx
│   ├── services/               # API services
│   │   ├── api.ts             # Axios configuration
│   │   ├── authService.ts
│   │   ├── chatService.ts
│   │   └── ...
│   ├── stores/                 # Zustand stores
│   │   ├── authStore.ts
│   │   ├── campaignStore.ts
│   │   └── ...
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app component
│   └── main.tsx               # Entry point
├── .env.example               # Environment template
├── index.html                 # HTML entry
├── package.json
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind config
├── vite.config.ts             # Vite config
└── README.md                  # This file
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `http://localhost:8080` |
| `npm run build` | Build production bundle |
| `npm run build:dev` | Build development bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Stripe (optional - for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Firebase (optional - for chat)
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🖼 Key Screens

### Authentication & Onboarding
- **Splash Screen** - Initial loading screen with brand logo
- **Walkthrough Screen** - Feature introduction carousel
- **Onboarding Screen** - Welcome screen with feature highlights
- **Auth Screen** - Login/Signup with role selection

### Model Screens
- **Model Feed** (`/model/feed`) - Main dashboard with:
  - Profile completeness tracker
  - Job alerts and notifications
  - Available campaigns list/swipe view
  - Recent matches
  - Photo upload section
- **Campaign Details** (`/model/campaign/:id`) - Full campaign information with apply button
- **Profile Creation** (`/model/profile-creation`) - Guided profile setup
- **Chat** (`/model/chat`) - Real-time messaging interface

### Agency Screens
- **Agency Feed** (`/agency/feed`) - Main dashboard with:
  - Model discovery (swipe interface)
  - Campaign management
  - Match management
- **Campaign Creation** (`/agency/campaign-create`) - Create new campaigns
- **Campaign Edit** (`/agency/campaign/:campaignId/edit`) - Edit existing campaigns
- **Search** (`/agency/search`) - Advanced talent search with filters
- **Chat** (`/agency/chat`) - Professional communication interface

### Shared Screens
- **User Detail** (`/user/:id`) - Public profile view
- **Settings** (`/settings`) - Account and preferences

---

## 🏗 Architecture Highlights

### State Management Strategy
- **Zustand** for client-side state (auth, UI preferences)
- **TanStack Query** for server state (campaigns, messages, profiles)
- **React Context** for language and theme

### Performance Optimizations
- **React.memo** for component memoization
- **useMemo** and **useCallback** for expensive computations
- **Code splitting** with React.lazy
- **SWC compiler** for faster builds

### Type Safety
- **Full TypeScript coverage** with strict mode
- **Zod schemas** for runtime validation
- **Type inference** from API responses

### Accessibility
- **Radix UI primitives** for accessible components
- **ARIA labels** and semantic HTML
- **Keyboard navigation** support
- **Screen reader** optimized

### Internationalization
- **Centralized translation system** in `LanguageContext`
- **Dynamic language switching** without page reload
- **Pluralization support** for complex translations
- **Fallback to English** for missing translations

---

## 💻 Development Guide

### Adding a New Screen

1. Create component in `src/components/`
2. Add route in `src/pages/Index.tsx`
3. Register route in `src/App.tsx`
4. Add translations to `src/contexts/LanguageContext.tsx`

### Adding a New API Service

1. Create service file in `src/services/`
2. Use `axios` from `src/services/api.ts` (includes auth headers)
3. Add types in `src/types/`
4. Create Zustand store if needed in `src/stores/`

### Styling Guidelines

- Use **Tailwind CSS** utility classes
- Follow **shadcn/ui** component patterns
- Maintain **consistent spacing** (4px grid)
- Use **semantic color names** from Tailwind config

### Code Style

- **TypeScript strict mode** enabled
- **Functional components** with hooks
- **ESLint** for code quality
- **Prettier** (if configured) for formatting

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Support

For support, email [muntazer.mehdi.rizvi@gmail.com] or open an issue in the repository.

