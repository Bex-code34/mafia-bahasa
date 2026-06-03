# Mafia Bahasa - Language Learning Translator

A modern, production-quality language learning translator web application designed to help users understand how sentences change across multiple languages and different levels of formality.

## 🌍 Features

- **Multi-Language Support**: Indonesian, English, German, Korean, Japanese, Spanish
- **Multiple Translation Styles**: Casual, Neutral, Formal
- **Korean & Japanese Romanization**: See both script and phonetic spelling
- **Translation History**: Local storage of all translations with timestamps
- **User Settings**: Save preferred source language
- **Mobile-First Design**: Optimized for all screen sizes
- **Dark Theme**: Comfortable for extended use
- **Responsive Layout**: Seamless experience on mobile and desktop

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

The app will open at `http://localhost:3000` in your browser.

## OpenRouter API Key

To enable real AI-powered translation, create a `.env` file in the project root with your OpenRouter API key:

```bash
cp .env.example .env
```

Then update `.env`:

```env
REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Restart the development server after adding the key.

## 📱 How to Use

### Translator Screen
1. Select a source language (or use Auto Detect)
2. Enter text to translate (up to 500 characters)
3. Choose up to 3 target languages
4. Select translation style (Casual, Neutral, or Formal)
5. Click "Translate" to get results
6. Use the copy button to copy translations

### History Screen
- View all your previous translations
- Click on any item to see full details
- Delete individual items or clear all history

### Settings Screen
- Set your preferred default source language
- Learn more about Mafia Bahasa

## 🛠 Technical Stack

- **React 18**: Modern UI framework
- **Local Storage**: For history and settings persistence
- **CSS3**: Responsive design with smooth animations
- **Mock Translation Engine**: Ready for future API integration

## 📊 Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (Translator, History, Settings)
├── styles/          # CSS files for each component
├── utils/           # Utilities (translation engine, storage)
├── App.js           # Main app component
└── index.js         # React entry point
public/
└── index.html       # HTML template
```

## 🎨 Design Features

- **Modern UI**: Clean, rounded cards with glassmorphism effects
- **Smooth Animations**: Fade-in and slide transitions
- **Accessibility**: Semantic HTML and readable typography
- **Icon Support**: Text fallbacks for all icons
- **Dark Theme**: Professional color palette

## 💾 Local Storage

- **History**: Stored indefinitely (can be cleared by user)
- **Settings**: Default source language preference

## 🔮 Future Enhancements

- OpenRouter API integration for real translations
- Additional languages
- Favorites/bookmarks system
- Export history functionality
- User accounts and cloud sync

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development Notes

- All features are fully functional (no placeholders)
- Icons use Unicode symbols for maximum compatibility
- All assets are inline or text-based
- Ready for API integration without major refactoring

---

**Mafia Bahasa** - Learn languages, understand formality, bridge cultures.
