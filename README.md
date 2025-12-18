# Microsoft Ugly Sweater Swapper 🎄

A retro Windows 95-themed web application that uses **Gemini 3 Pro Image** AI to dress anyone in the Microsoft Ugly Sweater!

![Windows 95 Style](https://img.shields.io/badge/Style-Windows%2095-008080)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)
![Gemini AI](https://img.shields.io/badge/Gemini-3%20Pro%20Image-4285F4)

## 🎯 Features

- **AI-Powered Sweater Swap**: Upload a photo and watch AI magically dress you in the Microsoft Ugly Sweater
- **Windows 95 Aesthetic**: Authentic retro UI with draggable windows, taskbar, and classic styling
- **Dual App System**:
  - **Sweater App**: AI-powered sweater overlay with Gemini 3 Pro Image
  - **Paint App**: Classic MS Paint clone with drawing tools
- **Export to Paint**: Send your creation to the Paint app for further editing
- **Save & Download**: Export your masterpiece as PNG

## 🏗️ Architecture

```
microsoft-ugly-sweater/
├── src/
│   ├── App.jsx                 # Desktop Manager (Windows 95 Desktop)
│   ├── main.jsx               # React entry point
│   ├── index.css              # Tailwind + Windows 95 styles
│   ├── apps/
│   │   ├── SweaterApp.jsx     # AI Sweater Swap Application
│   │   └── PaintApp.jsx       # MS Paint Clone
│   └── components/
│       ├── Taskbar.jsx        # Windows 95 Taskbar
│       └── ui/
│           ├── RetroButton.jsx      # Win95 styled button
│           ├── RetroPopup.jsx       # Win95 dialog box
│           └── RetroLoadingModal.jsx # Win95 loading indicator
├── public/
│   ├── ms-ugly-sweater.png    # The Microsoft Ugly Sweater asset
│   └── paint-icon.png         # MS Paint icon
├── tailwind.config.js         # Tailwind with Win95 theme
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies
```

## 🧠 AI Pipeline

The application uses **Gemini 3 Pro Image** (`gemini-3-pro-image-preview`) for intelligent image editing:

1. **User uploads photo** → Converted to Base64
2. **Sweater image loaded** → Microsoft Ugly Sweater PNG
3. **Both images sent to Gemini 3 Pro** with prompt:
   > "Place the sweater from the second image onto the person in the first image. Keep face, hair, skin tone, and background exactly the same."
4. **AI generates new image** → Displayed in the app
5. **Fallback**: If AI fails, manual drag-and-drop overlay is available

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/shalevamin/microsoft-ugly-sweater-.git
cd microsoft-ugly-sweater-

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your Gemini API key to .env
# VITE_GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Important**: Never commit your API key! The `.env` file is gitignored.

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file

## 🎨 Tech Stack

| Technology             | Purpose                        |
| ---------------------- | ------------------------------ |
| **React 19**           | UI Framework                   |
| **Vite 6**             | Build Tool                     |
| **Tailwind CSS**       | Styling (customized for Win95) |
| **Gemini 3 Pro Image** | AI Image Generation            |
| **html2canvas**        | Screenshot/Export              |
| **react-draggable**    | Draggable windows              |
| **Lucide React**       | Icons                          |

## 📸 Screenshots

The app features a complete Windows 95 desktop environment with:

- Draggable windows
- Classic taskbar with Start button
- Authentic menu bars
- Retro loading indicators
- Classic dialog boxes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Microsoft** - Ugly Sweater design inspiration
- **Google** - Gemini 3 Pro Image AI
- **Windows 95** - The aesthetic that never dies

---

Made with ❤️ and a lot of nostalgia for the 90s
