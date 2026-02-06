import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { app, httpServer } from "./lib/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT; 
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); //解析json请求体，限制10MB
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


app.use("/api/auth", authRoutes); //挂载路由
app.use("/api/messages", messageRoutes);

// 生产环境下提供前端静态文件
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // 所有非 API 路由都返回 index.html（SPA 路由支持）
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

//启动服务器 暴露端口 连接数据库
httpServer.listen(PORT, () => {
  console.log("server is running on port " + PORT);
  connectDB(); //连接数据库
});
