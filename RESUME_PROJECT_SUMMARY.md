# Orange's Folks — MERN 全栈聊天应用 · 简历项目总结

> 面向简历的技术重点、成长亮点、未来计划与优化思考

---

## 一、项目概述（可写进简历的一句话）

**实时聊天应用**：基于 MERN 技术栈，实现用户注册/登录、一对一实时消息、图片消息与在线状态；后端 TypeScript + Express + Socket.io，前端 React 19 + Vite + Zustand，采用 JWT HttpOnly Cookie 鉴权与 Cloudinary 图床。

---

## 二、技术重点（简历 bullet 可直接用）

### 后端
- **Node.js + Express 5**：RESTful API 设计，路由分层（auth / messages），`express.json({ limit: "10mb" })` 支持大图上传
- **TypeScript**：全后端 TS 编写，类型安全与可维护性
- **MongoDB + Mongoose**：User / Message 模型，timestamps、ref 关联与索引（email unique）
- **JWT + Cookie 鉴权**：`generateJWT` 写入 HttpOnly、SameSite=strict、secure 生产环境，7 天过期；`protectRouter` 中间件统一校验并挂载 `req.user`
- **Socket.io**：独立 `http.Server` 与 Express 同端口；`onlineUsersMap` 维护 userId→socketId，连接/断开时广播 `getOnlineUsers`；`sendMessage` 后通过 `getReceiverSocketId` 对目标用户单播 `newMessage`，实现实时推送
- **Cloudinary**：头像上传（updateProfile）、消息图片上传（sendMessage），base64 上传后存 `secure_url`
- **生产部署**：`NODE_ENV=production` 时托管 `frontend/dist` 并 SPA fallback，前后端一体部署

### 前端
- **React 19 + Vite 7**：现代构建与 HMR
- **Zustand**：`useAuthStore`（authUser、socket、onlineUsers、checkAuth/login/logout/connectSocket）、`useChatStore`（users、messages、selectedUser、fetchMessage/sendMessage、subscribeToMessages），跨组件状态与 Socket 订阅集中管理
- **React Router 7**：路由守卫（未登录重定向 `/login`，已登录访问 signup/login 重定向 `/`），`checkAuth` 后统一 loading
- **Socket.io-client**：`query: { userId }` 建连，监听 `getOnlineUsers` / `newMessage`，与 Zustand 联动
- **Axios**：`withCredentials: true` 携带 Cookie，统一 baseURL
- **Tailwind CSS 4 + DaisyUI**：响应式布局、主题（`data-theme`）、组件样式
- **Lucide React + react-hot-toast**：图标与轻量反馈

### 安全与工程
- 密码 bcrypt 加盐存储；JWT 不暴露给 JS（HttpOnly）；CORS 限定 origin、credentials
- 环境变量：`MONGODB_URI`、`JWT_SECRET`、Cloudinary 三件套、前端 `VITE_API_URL`

---

## 三、突出你的成长（面试可讲）

1. **从 REST 到实时**：不仅会写 CRUD，还掌握 Socket.io 与 HTTP 同端口共存、在线列表与点对点推送，理解「存库 + 推一条」的双写模式。
2. **鉴权闭环**：从「只写登录接口」到完整方案：Cookie 存 JWT、中间件校验、前端 withCredentials、路由守卫与 checkAuth 初始化，形成可复用的鉴权体系。
3. **状态与副作用**：用 Zustand 把 Auth + Socket + Chat 三个关注点拆到 store，并在 `subscribeToMessages` / `unsubscribeToMessages` 里做事件订阅与清理，体现对 React 生命周期与内存泄漏的考虑。
4. **全栈 TypeScript**：后端全 TS、ESM，与 Mongoose/Express 类型配合，体现工程化习惯。
5. **部署意识**：生产环境静态资源 + SPA fallback、环境变量区分 dev/prod，说明有「从本地跑到上线」的完整思路。

---

## 四、项目未来计划（简历/面试「后续规划」）

- **功能**：群聊与频道、未读/已读、消息撤回与编辑、输入状态（typing indicator）、历史消息分页/虚拟列表。
- **体验**：消息本地乐观更新、失败重试、图片压缩与懒加载、移动端适配与 PWA。
- **架构**：消息队列（如 Redis）做离线消息与推送、读写分离或分库分表为扩展做准备、Socket 房间与多实例 sticky session 或 Redis adapter。
- **工程**：单元测试（Vitest）、E2E（Playwright）、CI/CD、Docker 化与一键部署文档。

---

## 五、Tradeoff 思考（体现你懂取舍）

| 点 | 当前选择 | 原因 / 可说的 tradeoff |
|----|----------|------------------------|
| 鉴权 | JWT 放 Cookie 而非 localStorage | 防 XSS 窃取 token；需处理跨域与 SameSite，移动端或纯 API 场景可再考虑 Bearer。 |
| 实时 | Socket.io 单实例 + 内存 Map | 实现简单、无额外依赖；多实例需 Redis adapter 或 sticky session。 |
| 图片 | Base64 经后端再传 Cloudinary | 前端简单、易做预览；大图占带宽与 body，可改为前端直传 Cloudinary 签名上传。 |
| 状态管理 | Zustand 而非 Redux | 够用、代码少、与 Socket 结合自然；复杂表单或跨页编排可再考虑 Redux 或 Context 分层。 |
| 数据库 | MongoDB 存消息 | 灵活、易迭代；历史量极大时需考虑分页、归档或到时引入时序/检索方案。 |

---

## 六、可以做的优化（代码级 + 架构级）

### 代码与安全
- **错误处理**：controller 里 `catch` 统一用结构化日志（如 `logger.error`）并避免把堆栈直接返回前端；可抽成 `asyncHandler` 或统一 error middleware。
- **校验**：用 Joi/Zod 做 `signup/login/profile` 的 body 校验，避免只靠 if 判断。
- **类型**：`req: any, res: any` 改为 `Request`/`Response` 并扩展 `req.user` 类型，提高可维护性。
- **SPA 路由**：生产环境 fallback 用 `app.get("*", ...)`（或当前框架推荐写法），确保所有非 API、非静态请求都回 index.html。

### 性能与体验
- **消息列表**：历史消息分页（如 `limit + skip` 或 cursor），前端虚拟滚动（如 react-window）减轻 DOM 压力。
- **图片**：前端压缩再上传、Cloudinary 使用 resize/quality 参数生成缩略图，列表用缩略图、点击再大图。
- **乐观更新**：`sendMessage` 先在前端插入一条 pending，收到 201 后改为 confirmed，失败则回滚并 toast，提升体感延迟。

### 架构与可扩展
- **Socket 多实例**：上线多节点时用 `@socket.io/redis-adapter` 做广播与房间，或 Nginx 做 sticky session。
- **离线消息**：未在线时消息只落库，上线后拉取未读或通过队列补推，避免丢消息。
- **接口规范**：统一 res 格式如 `{ data, message, code }`，便于前端与错误码体系。

### 运维与工程
- **健康检查**：如 `GET /health` 检查 DB 与关键依赖，便于 K8s/云负载均衡探活。
- **环境**：CORS origin、Cookie secure 等用 `process.env` 区分，避免生产用 localhost。
- **README**：补充本地 `.env.example`、启动步骤、常见问题，方便面试官或协作方一键跑起。

---

## 七、简历项目描述示例（中英）

**中文：**
- 使用 **MERN 技术栈**开发实时聊天应用，支持注册登录、一对一文字/图片消息与在线状态展示。
- 后端 **TypeScript + Express** 提供 REST API，**JWT HttpOnly Cookie** 鉴权，**Socket.io** 实现消息实时推送与在线用户列表。
- 前端 **React 19 + Vite + Zustand** 管理全局状态与 Socket 订阅，**Tailwind + DaisyUI** 实现响应式 UI 与主题切换。
- 集成 **Cloudinary** 处理头像与消息图片上传；生产环境前后端一体部署，具备扩展为群聊与离线消息的计划。

**English:**
- Built a **real-time chat app** with the **MERN stack**: user auth, 1-to-1 text/image messages, and online presence.
- **Backend**: TypeScript, Express, JWT in HttpOnly cookies, Socket.io for real-time delivery and online user list.
- **Frontend**: React 19, Vite, Zustand for state and socket subscription, Tailwind + DaisyUI for responsive UI and theming.
- Integrated **Cloudinary** for avatars and message images; production single-server deployment; planned extensions: group chat, read receipts, offline message queue.

---

把上述「技术重点」和「成长」融入简历 bullet，「未来计划」和「Tradeoff/优化」在面试时按需展开，既能体现实现能力，也能体现对扩展性和工程化的思考。
