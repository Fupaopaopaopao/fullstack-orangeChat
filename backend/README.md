
# Project Setup 

This is a TypeScript-based Express backend project with ESModule support (`"type": "module"`). It uses `ts-node` for development and `tsc` for production builds.

---

## 1. Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) installed (recommended version 18+).

```bash
npm install
```

---

## 2. Run Development Server

Use `ts-node` + `nodemon` to watch `.ts` file changes and reload automatically during development.

```bash
npm run dev
```

Default URL: `http://localhost:5001`

---

## 3. Build for Production

Compile TypeScript source code into JavaScript using the TypeScript compiler.

```bash
npm run build
```

The output will be in the `dist/` folder.

---

## 4. Start Production Server

Run the compiled JavaScript code with Node.js:

```bash
npm start
```

Make sure your `.env` file is properly configured (see below).

---

## 5. Project Structure Overview

```
backend/
├── src/                 // Source code
│   ├── index.ts         // Entry point
│   └── routes/          // Route files
├── dist/                // Compiled output
├── tsconfig.json        // TypeScript config
├── package.json
├── .env                 // Environment variables (create manually)
```

---

## 6. Environment Variables (`.env`)

Create a `.env` file in the root directory with the following example content:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

---

## 7. Important Notes

* With `"type": "module"`, all local imports **must include the `.js` extension**:

  ```ts
  import authRoutes from "./routes/auth.route.js";
  ```

* All build output goes into the `dist/` folder. In production, simply run `node dist/index.js`.

* TypeScript configuration uses `"module": "ESNext"` and `"target": "ES2020"` (see `tsconfig.json`).

---

## Scripts Summary

| Command          | Description                              |
|------------------|------------------------------------------|
| `npm run dev`    | Start development mode with hot reload   |
| `npm run build`  | Compile TypeScript to JS in `dist/`      |
| `npm start`      | Run the production build with Node.js    |

---

