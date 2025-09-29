# 🤖 SuperID AMA - AI Chat Interface

A sleek, full-stack AI chat application built with React, Express, TypeScript, and Tailwind CSS. Features real-time conversations with AI models through Groq's lightning-fast inference API.

![Chat Interface](https://img.shields.io/badge/Interface-Modern-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![AI Powered](https://img.shields.io/badge/AI-Groq%20API-green)

## ✨ Features

- **💬 Real-time AI Conversations** - Chat with state-of-the-art language models
- **🚀 Blazing Fast** - Powered by Groq's LPU inference engine (300+ tokens/sec)
- **🎨 Beautiful UI** - Modern, responsive design with Tailwind CSS
- **💾 Conversation History** - Persistent chat sessions with local storage
- **🛠 Type-Safe** - Full TypeScript implementation
- **⚡ Hot Reload** - Instant development feedback with Vite
- **🔒 Secure** - Environment-based API key management

## 🏗 Architecture

```
📦 AMA AI Chat
├── 🎨 Frontend (React + TypeScript + Tailwind)
├── 🔧 Backend (Express + TypeScript)
├── 💾 Storage (In-memory with persistence)
└── 🤖 AI Integration (Groq API)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Groq API account ([Get free API key](https://console.groq.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/nrikot/AMA_AI_Chat.git
   cd AMA_AI_Chat
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Groq API key:

   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5000`

## 🎯 Usage

1. **Start a new conversation** - Click the + button
2. **Type your message** - Ask questions, get coding help, or just chat
3. **Get instant responses** - Experience Groq's lightning-fast AI
4. **Manage conversations** - Switch between different chat sessions

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Lucide React** - Beautiful icons

### Backend

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Groq API** - AI inference
- **Zod** - Schema validation

## 🔧 API Endpoints

| Method   | Endpoint                          | Description               |
| -------- | --------------------------------- | ------------------------- |
| `GET`    | `/api/conversations`              | Get all conversations     |
| `POST`   | `/api/conversations`              | Create new conversation   |
| `GET`    | `/api/conversations/:id/messages` | Get conversation messages |
| `POST`   | `/api/chat/completions`           | Send message to AI        |
| `DELETE` | `/api/conversations/:id`          | Delete conversation       |

## 🤖 AI Models Supported

- **`llama-3.1-8b-instant`** - Fast, capable general-purpose model
- **`mixtral-8x7b-32768`** - High-quality mixture of experts
- **`llama-3.2-1b-preview`** - Ultra-fast for simple tasks

## 🎨 UI Components

The app features a clean, modern interface with:

- **Sidebar navigation** for conversation management
- **Real-time message streaming** (optional)
- **Responsive design** for mobile and desktop
- **Dark/light mode** ready (easily extendable)
- **Custom SVG icons** and Lucide icon integration

## 🚀 Deployment

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Environment Variables

| Variable       | Description                          | Required |
| -------------- | ------------------------------------ | -------- |
| `GROQ_API_KEY` | Your Groq API key                    | ✅       |
| `NODE_ENV`     | Environment (development/production) | ❌       |
| `PORT`         | Server port (default: 5000)          | ❌       |

## 🤝 Contributing

We love contributions! Here's how to help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run check    # TypeScript type checking
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for their incredible inference speed
- **Vercel** for the amazing React and Next.js ecosystem
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons

## 🐛 Troubleshooting

### Common Issues

**API Key Issues**

- Ensure your Groq API key is correctly set in `.env`
- Check that your Groq account has available credits

**Build Issues**

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Ensure you're using Node.js 18 or higher

**Styling Issues**

- The app uses Tailwind CSS - ensure all classes are properly purged in production

---

**⭐ Star this repo if you found it helpful!**

---

<div align="center">

_Built with ❤️ and lots of ☕_

[Report Bug](https://github.com/nrikot/AMA_AI_Chat/issues) · [Request Feature](https://github.com/nrikot/AMA_AI_Chat/request)

</div>
```

## Key Features of This README:

1. **Eye-catching badges** for quick project overview
2. **Clear feature list** with emojis for visual appeal
3. **Architecture diagram** for technical understanding
4. **Quick start guide** for immediate setup
5. **Comprehensive tech stack** breakdown
6. **API documentation** for developers
7. **Troubleshooting section** for common issues
8. **Professional formatting** with proper sections
9. **Contributing guidelines** for open-source collaboration
10. **Visual elements** to break up text and improve readability

You can customize the repository URL, add screenshots, and modify any sections to better match your specific implementation!
