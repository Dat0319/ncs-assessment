
# ✅ Node.js Security Checklist (Technical Leader)

---

## 1. 🔐 Authentication & Authorization

- [ ] Sử dụng `bcrypt`, `argon2` để hash mật khẩu
- [ ] Dùng `JWT` với `HttpOnly + Secure` cookies (ưu tiên) hoặc OAuth2
- [ ] Áp dụng **Rate limiting** & **Account lockout**
- [ ] Sử dụng thư viện như `express-session`, `passport.js`, `jsonwebtoken`
- [ ] Phân quyền chi tiết theo RBAC (Role-Based Access Control)

---

## 2. 🔒 Security Middleware

- [ ] `helmet` – Thiết lập các HTTP security headers
- [ ] `cors` – Chỉ cho phép trusted origins
- [ ] `express-rate-limit` – Giới hạn request/IP
- [ ] `xss-clean` – Chống XSS
- [ ] `hpp` – Chống HTTP parameter pollution
- [ ] `express-mongo-sanitize` – Ngăn chặn NoSQL injection

---

## 3. 🧼 Input Validation & Sanitization

- [ ] Dùng `Joi`, `express-validator`, `yup`, `zod` để validate mọi request body, params, query
- [ ] Không bao giờ tin tưởng dữ liệu từ phía client
- [ ] Validate upload file (size, type, extension)

---

## 4. 🔐 Bảo mật Cookie & Token

- [ ] Không lưu token trong `localStorage` (dễ bị XSS)
- [ ] Dùng `HttpOnly` + `Secure` cookies để lưu JWT
- [ ] Dùng `SameSite=Strict` để chống CSRF
- [ ] Set `token expiration` hợp lý

---

## 5. 📁 Bảo mật thư mục & file

- [ ] Không public `node_modules`, `.env`, `package-lock.json`
- [ ] Sử dụng `.gitignore` chuẩn
- [ ] Lưu secrets/API keys vào `.env` và dùng dotenv
- [ ] Sử dụng `process.env` để cấu hình bảo mật (không hardcode)

---

## 6. 🔧 Production Hardening

- [ ] Tắt x-powered-by (`app.disable('x-powered-by')`)
- [ ] Dùng `pm2` hoặc Docker để chạy app production
- [ ] Cấu hình HTTPS (Let's Encrypt, Nginx)
- [ ] Giới hạn size của request body (`express.json({ limit: '10kb' })`)
- [ ] Thường xuyên update dependencies (`npm audit`, `snyk`, `npm-check-updates`)
- [ ] Quét bảo mật mã nguồn (`npx eslint .`, `SonarQube`, `Snyk`)

---

## 7. 🔍 Logging & Monitoring

- [ ] Dùng `winston`, `morgan`, hoặc `pino` để log
- [ ] Đẩy log về hệ thống như ELK, Datadog, Grafana Loki
- [ ] Alert khi có lỗi 5xx nhiều bất thường
- [ ] Không log thông tin nhạy cảm (password, token, credit card)

---

## 8. 🔒 Database

- [ ] Không dùng user `root` để connect DB
- [ ] Dùng ORM như Prisma/TypeORM/Sequelize hoặc prepared statements
- [ ] Escape dữ liệu đầu vào để tránh SQL injection
- [ ] Encrypt dữ liệu nhạy cảm (như thông tin user)

---

## 9. 🔥 DDoS & Firewall Protection

- [ ] Sử dụng Cloudflare hoặc AWS Shield
- [ ] Cài đặt WAF (Web Application Firewall)
- [ ] Giới hạn kết nối đến server (fail2ban, iptables)

---

## 10. ☁️ CI/CD & DevOps

- [ ] Kiểm soát Git Access (không dùng token cá nhân public)
- [ ] Không commit secrets vào repo
- [ ] Sử dụng secret manager: AWS Secrets Manager, Vault
- [ ] Kiểm tra dependency vulnerability trong pipeline (`npm audit --production`)
- [ ] Có thể tích hợp `docker scan`, `trivy` để scan image
