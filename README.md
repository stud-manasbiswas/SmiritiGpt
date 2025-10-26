# 🧠 SmiritiGPT - AI-Powered Conversational Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7.x-red.svg)](https://redis.io/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3.x-orange.svg)](https://www.langchain.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📖 Overview

SmiritiGPT is an intelligent conversational AI platform that combines advanced language models with Retrieval-Augmented Generation (RAG) to provide context-aware responses. The system maintains conversation memory across sessions and allows users to upload documents for enhanced, document-grounded conversations.

**Key Capabilities:**
- Intelligent chat with conversation memory
- Document upload and semantic search
- Context-aware responses using RAG
- User authentication and data persistence
- Production-ready with rate limiting and error handling

## ✨ Features

### Core Features
- **AI-Powered Chat**: Leverages Groq's Llama 3.3 70B for fast, intelligent responses
- **Conversation Memory**: Redis-backed memory system retains context for 7 days
- **RAG Implementation**: Query uploaded documents using vector similarity search
- **Document Support**: Process PDF, DOCX, and TXT files for enhanced AI responses
- **User Authentication**: Secure JWT-based authentication with bcrypt encryption
- **Real-time Performance**: Sub-500ms average response time

### Technical Features
- Rate limiting for API protection
- Comprehensive error handling
- Input validation and sanitization
- CORS security configuration
- MongoDB indexing for optimized queries
- Redis caching for performance

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────────────────┐
│   Express.js Backend    │
│  (REST API + Middleware)│
└──────┬──────────────────┘
       │
       ├─────────────┬─────────────┬──────────────┐
       │             │             │              │
┌──────▼──────┐ ┌───▼────┐ ┌─────▼─────┐ ┌──────▼──────┐
│  MongoDB    │ │ Redis  │ │  Groq AI  │ │  ChromaDB   │
│  (Data)     │ │(Memory)│ │   (LLM)   │ │  (Vectors)  │
└─────────────┘ └────────┘ └───────────┘ └──────┬──────┘
                                                  │
                                          ┌───────▼────────┐
                                          │  HuggingFace   │
                                          │  (Embeddings)  │
                                          └────────────────┘
```

### Data Flow
1. User sends message → Express API
2. API retrieves conversation history from Redis
3. If documents uploaded → ChromaDB performs vector search
4. Context + message sent to Groq LLM via LangChain
5. Response saved to MongoDB & Redis
6. Response returned to user

## 📁 Folder Structure

```
Backend/
│
├── config/
│   ├── database.js              # MongoDB connection setup
│   └── redis.js                 # Redis client configuration
│
├── controllers/
│   ├── authController.js        # Handles login, register, logout
│   ├── chatController.js        # Manages chat messages and conversations
│   └── documentController.js    # Handles document upload and queries
│
├── middleware/
│   ├── auth.js                  # JWT token verification
│   ├── errorHandler.js          # Global error handling
│   └── rateLimiter.js           # Request rate limiting
│
├── models/
│   ├── User.js                  # User schema (email, password, etc.)
│   ├── Conversation.js          # Conversation schema with messages
│   └── Document.js              # Document metadata schema
│
├── routes/
│   ├── auth.js                  # /api/auth/* endpoints
│   ├── chat.js                  # /api/chat/* endpoints
│   └── documents.js             # /api/documents/* endpoints
│
├── services/
│   ├── aiService.js             # Groq AI integration with LangChain
│   └── ragService.js            # ChromaDB + HuggingFace embeddings
│
├── uploads/                      # Temporary file storage
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── server.js                    # Application entry point
```

## 🛠️ Implementation Details

### Tech Stack

**Backend Framework**
- Node.js 18+ with Express.js
- RESTful API architecture
- Middleware-based request processing

**Databases**
- **MongoDB**: User data, conversations, document metadata
- **Redis**: Session management, conversation memory caching
- **ChromaDB**: Vector embeddings for semantic search

**AI/ML Stack**
- **Groq**: LLM inference (Llama 3.3 70B model)
- **LangChain**: AI orchestration and conversation chains
- **HuggingFace**: Text embeddings (sentence-transformers/all-MiniLM-L6-v2)

**Security**
- JWT tokens for authentication
- bcrypt for password hashing (10 rounds)
- Express rate limiter
- Helmet.js for security headers
- Input validation with express-validator



## 🚀 Running Locally

### Prerequisites

Install the following on your system:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (v7 or higher) - [Download](https://redis.io/download)
- **Python 3.8+** (for ChromaDB) - [Download](https://www.python.org/)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/SmiritiGpt.git
cd SmiritiGpt/Backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Install ChromaDB

```bash
pip install chromadb
```

### Step 4: Get Free API Keys

**Groq API Key (Free):**
1. Visit https://console.groq.com
2. Sign up for free account (no credit card required)
3. Navigate to API Keys section
4. Create new API key
5. Copy the key

**HuggingFace Token (Free):**
1. Visit https://huggingface.co/settings/tokens
2. Sign up for free account
3. Click "New token"
4. Copy the token

### Step 5: Configure Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database URLs
MONGODB_URI=mongodb://localhost:27017/smiritgpt
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AI Service API Keys
GROQ_API_KEY=your_groq_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Vector Database
CHROMA_URL=http://localhost:8000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 6: Start Required Services

**Terminal 1 - Start MongoDB:**
```bash
# macOS/Linux
mongod --dbpath /usr/local/var/mongodb

# Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Terminal 2 - Start Redis:**
```bash
# macOS/Linux
redis-server

# Windows
redis-server.exe
```

**Terminal 3 - Start ChromaDB:**
```bash
chroma run --path ./chroma_data
```

**Terminal 4 - Start Application:**
```bash
npm run dev
```

### Development Scripts

```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production mode
npm test         # Run tests (if configured)
```

## 🔐 Security

- JWT-based authentication with HTTP-only cookies option
- Password hashing using bcrypt (10 salt rounds)
- Rate limiting: 100 requests per 15 minutes per IP
- Input validation and sanitization
- CORS configured for specific origins
- Helmet.js for security headers
- MongoDB injection prevention through Mongoose
- Environment variables for sensitive data


## 👨‍💻 Author

**Your Name**
- GitHub: [@stud-manasbiswas](https://github.com/stud-manasbiswas)
- LinkedIn: [linkedin.com/in/manas-biswas214/](https://linkedin.com/in/manas-biswas214/)
- Email: manasbiswas.dev@gmail.com

---

<div align="center">

**⭐ If you find this project useful, please consider giving it a star!**

</div>
