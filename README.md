# Orange's Folks

> A real-time full-stack chat application built with the MERN stack.

Orange's Folks is a production-deployed real-time messaging platform supporting user authentication, one-to-one chat, image messages, and online presence tracking.

Built to explore real-time system design, secure authentication flows, and scalable full-stack architecture beyond traditional REST-based CRUD applications.

Frontend develop repo: https://github.com/Fupaopaopaopao/chatapp-frontend

App website: https://fullstack-orangechat.onrender.com/login
(It will take a couples of mins to load the server)

---

## Features

- User authentication (JWT in HttpOnly cookies)
- One-to-one real-time messaging
- Image message support (Cloudinary)
- Online user presence tracking
- Responsive UI with theme support
- Production single-server deployment

---

## Tech Stack

### Backend

- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- Socket.io
- Cloudinary
- JWT Authentication (HttpOnly Cookie)
- Single-server production deployment

### Frontend

- React 19 + Vite
- Zustand (global state + socket lifecycle)
- React Router 7
- Socket.io-client
- Axios
- Tailwind CSS 4 + DaisyUI
- Lucide + react-hot-toast

---

## Authentication Architecture

- JWT stored in **HttpOnly cookies** (not localStorage)
- Secure flag enabled in production
- SameSite=strict to mitigate CSRF
- Centralized `protectRouter` middleware
- Frontend initialized via `checkAuth` to ensure session persistence

### Tradeoff

Using cookies improves XSS protection but introduces SameSite/CORS considerations in cross-origin setups.

---

## Real-Time Design

- Express and Socket.io share a single HTTP server instance.
- In-memory `onlineUsersMap (userId → socketId)` tracks active sessions.
- Messages follow a dual-write model:
  1. Persist to MongoDB
  2. Emit real-time event to recipient (if online)

### Tradeoff

The current architecture runs in a single-node environment for simplicity.  
Scaling to multi-instance deployment would require a Redis adapter or sticky session configuration.

---

## Frontend State Design

Zustand stores are structured by concern:

- `useAuthStore` → authentication + socket connection
- `useChatStore` → users, messages, selected chat state
- Centralized subscription and cleanup logic for socket listeners

This design avoids unnecessary global re-renders and isolates side effects.

---

## Image Handling

Images are uploaded as base64 to backend → forwarded to Cloudinary → secure URLs stored in database.

### Tradeoff

Backend-forward upload simplifies client logic but increases payload size.  
Future improvement: signed direct upload to Cloudinary.

---

## Production Deployment

- Single-server architecture
- Static frontend served in `NODE_ENV=production`
- SPA fallback routing
- Environment-based configuration
- Secure cookie flags enabled in production

---

## Future Improvements

### Features

- Group chat and channels
- Read receipts & typing indicators
- Message editing / deletion
- Pagination & virtualized message list
- Offline message queue

### Architecture

- Redis adapter for Socket.io multi-instance scaling
- Optimistic UI updates
- Image compression before upload
- Cursor-based pagination
- CI/CD & Docker containerization

---

## Engineering Considerations

- bcrypt password hashing
- CORS with credential handling
- Structured API abstraction
- Full backend TypeScript
- Clear separation between REST and real-time logic

---

## 📦 Environment Variables

### Backend

- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NODE_ENV`

### Frontend (development)

- `VITE_API_URL`

---

## Purpose of the Project

This project was built to move beyond CRUD-based applications and explore:

- Real-time messaging systems
- Secure authentication patterns
- WebSocket lifecycle management
- State management with live events
- Deployment and scalability tradeoffs
