# Installation & Setup Guide for Mafia Bahasa

## Prerequisites

Before running the project, ensure you have installed:

1. **Node.js and npm** (from https://nodejs.org/)
   - Download LTS version (v18 or higher)
   - Verify installation:
     ```
     node --version
     npm --version
     ```

## Quick Start

### Step 1: Navigate to Project Directory
```bash
cd "c:\Users\Lenovo\OneDrive\Documents\MAFIA BAHASA"
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- react@^18.2.0
- react-dom@^18.2.0
- react-router-dom@^6.14.0
- react-scripts@5.0.1

### Step 2.5: Configure OpenRouter API Key
Copy the example environment file and add your OpenRouter API key:

```bash
cp .env.example .env
```

Open `.env` and set:

```env
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

The `.env` file is ignored by Git and should not be committed.

### Step 3: Start Development Server
```bash
npm start
```

The application will automatically open in your default browser at `http://localhost:3000`

## Project Structure

```
MAFIA BAHASA/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.js
│   │   ├── Navigation.js
│   │   ├── TranslationCard.js
│   │   └── HistoryItem.js
│   ├── pages/              # Page components
│   │   ├── TranslatorPage.js
│   │   ├── HistoryPage.js
│   │   └── SettingsPage.js
│   ├── styles/             # CSS files
│   │   ├── Header.css
│   │   ├── Navigation.css
│   │   ├── TranslatorPage.css
│   │   ├── TranslationCard.css
│   │   ├── HistoryPage.css
│   │   ├── HistoryItem.css
│   │   └── SettingsPage.css
│   ├── utils/              # Utility functions
│   │   ├── translationEngine.js
│   │   └── storage.js
│   ├── App.js              # Main app component
│   ├── App.css
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── package.json            # Project dependencies
├── .gitignore
└── README.md
```

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

## Features Overview

### ✓ Translator Screen
- Multi-language selection (6 languages)
- Real-time character counter (500 char limit)
- Up to 3 simultaneous target languages
- 3 translation styles (Casual, Neutral, Formal)
- Language swap functionality
- Mock translation data for testing
- Copy button with feedback

### ✓ History Screen
- Local storage of all translations
- Expandable history items
- Delete individual items
- Delete all history with confirmation
- Timestamps (relative dates)
- Full translation details

### ✓ Settings Screen
- Default source language preference
- Settings auto-persist in local storage
- About section with feature list
- Settings save confirmation

### ✓ Design Features
- Mobile-first responsive layout
- Dark theme by default
- Smooth animations
- Touch-friendly buttons
- Icon support with text fallbacks
- Accessibility-focused

## Troubleshooting

### Port 3000 Already in Use
If port 3000 is already in use:
```bash
npm start -- --port 3001
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -r node_modules
rm package-lock.json
npm install
```

## Browser Support

The application works on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Local Storage

The app uses browser's local storage for:
- Translation history (key: `mafiabahasaHistory`)
- User settings (key: `mafiabahasaSettings`)

To clear all data:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find the domain and delete both keys
4. Refresh the page

## Next Steps

The app is ready for future API integration. To connect to OpenRouter API:

1. Replace the mock `getTranslation` function in `src/utils/translationEngine.js`
2. Add API key management in the settings
3. Update error handling for network requests
4. Add loading states for real API calls

---

**Questions?** Check README.md for more information about the application.
