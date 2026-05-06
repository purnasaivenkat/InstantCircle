# Instant Circle 🚀

Instant Circle is a premium social connection app designed for instant, judgment-free conversations. Connect with others based on your current "vibe"—whether you need to vent, seek advice, or just chill.

![Instant Circle Preview](src/assets/hero.png)

## ✨ Features

- **Vibe-Based Matching**: Choose from Vent, Advice, Chill, or Casual circles.
- **Real-Time Chat**: Instant messaging powered by Insforge Realtime.
- **Privacy First**: No profiles, no history, no judgment.
- **Timed Conversations**: 10-minute circles to keep things fresh and meaningful.
- **Premium UI**: Sleek dark mode design with smooth Framer Motion animations.
- **Secure Auth**: Full authentication flow with email verification.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4
- **Backend/Database**: Insforge SDK
- **Animations**: Framer Motion
- **Routing**: React Router 7

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- An [Insforge](https://insforge.app) project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/purnasaivenkat/InstantCircle.git
   cd InstantCircle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_INSFORGE_URL=your_insforge_url
   VITE_INSFORGE_ANON_KEY=your_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components
├── context/        # Auth and Global State
├── lib/            # SDK configurations
├── pages/          # Main application screens
└── assets/         # Images and styles
```

## 📄 License

This project is licensed under the MIT License.
