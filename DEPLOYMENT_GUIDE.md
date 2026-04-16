# 子应用部署指南

本文档提供部署 `F:\develop\app` 目录下子应用的标准化流程。

---

## 部署前检查清单

- [ ] 服务器已安装 Node.js 18+
- [ ] PM2 已安装 (`npm install -g pm2`)
- [ ] 应用代码已同步到服务器
- [ ] Nginx 配置已更新
- [ ] 数据库 App 记录已创建

---

## 标准部署流程

### 1. 统一技能平台 (unified-skills)

```bash
# 停止旧进程
pm2 delete unified-skills 2>/dev/null

# 进入目录
cd /root/autoWrite/unified-skills-platform

# 安装依赖（如果需要）
npm install

# 构建
npm run build

# 启动
PORT=3021 pm2 start 'npm start' --name unified-skills

# 保存 PM2 进程列表
pm2 save
```

### 2. 制造业技能平台 (manufacturing-skills)

```bash
# 停止旧进程
pm2 delete manufacturing-skills 2>/dev/null

# 进入目录
cd /root/autoWrite/manufacturing-ai-skills/unified-manufacturing-platform

# 安装依赖
npm install

# 构建
npm run build

# 启动
PORT=3020 pm2 start 'npm start' --name manufacturing-skills

# 保存
pm2 save
```

### 3. AI 工作诊断 (meme-analyzer)

```bash
# 停止旧进程
pm2 delete meme-analyzer 2>/dev/null

# 进入目录
cd /root/autoWrite/meme-analyzer

# 安装依赖
npm install

# 构建
npm run build

# 启动
PORT=3003 pm2 start 'npm start' --name meme-analyzer

# 保存
pm2 save
```

---

## Nginx 配置更新

在 `/root/autoWrite/ai-portal/nginx.conf` 的 `server` 块中添加：

```nginx
# my-new-app
location ^~ /my-new-app {
    proxy_pass http://127.0.0.1:端口号;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

重载 Nginx：
```bash
nginx -s reload
```

---

## 数据库注册

创建应用记录：

```sql
-- 检查现有记录
SELECT * FROM "App" WHERE id = 'my-app-id';

-- 插入新记录
INSERT INTO "App" (
  id, name, description, icon, url,
  "groupId", "categoryId", isActive, creditCost,
  isDefault, price, config, "createdAt"
) VALUES (
  'my-app-id',
  '应用名称',
  '应用描述',
  '🚀',
  'http://47.112.29.121/my-app-path/?skill=skill-id',
  '7802c491-29b8-472b-b1c0-c200e5c76276',
  '0f2915c3-84fa-4539-aa79-4f0e72f2aab8',
  true, 100, false, 0, '{}', NOW()
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  url = EXCLUDED.url;
```

---

## 验证部署

```bash
# 检查 PM2 状态
pm2 list

# 检查端口监听
netstat -tlnp | grep -E '3020|3021|3003'

# 本地测试
curl -I http://localhost:3021/unified-skills/
curl -I http://localhost:3020/manufacturing-skills/
curl -I http://localhost:3003/meme-analyzer/

# 远程测试
curl -I http://47.112.29.121/unified-skills/
curl -I http://47.112.29.121/manufacturing-skills/
curl -I http://47.112.29.121/meme-analyzer/
```

---

## 故障排查

### 502 Bad Gateway
- PM2 进程是否运行
- 端口是否被占用
- 应用是否启动失败（查看 `pm2 logs`）

### 401 Unauthorized
- URL 是否包含 `token` 参数
- token 是否过期
- 主站 API 是否正常

### 积分不足
- 用户积分是否充足
- appId 是否正确

### 应用空白页
- 检查浏览器控制台错误
- 确认 basePath 配置正确
- 确认 Next.js 构建成功

---

## 一键部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

APP_NAME=$1
APP_DIR=$2
APP_PORT=$3
NGINX_CONF="/root/autoWrite/ai-portal/nginx.conf"

if [ -z "$APP_NAME" ] || [ -z "$APP_DIR" ] || [ -z "$APP_PORT" ]; then
    echo "Usage: ./deploy.sh <app-name> <app-dir> <port>"
    echo "Example: ./deploy.sh unified-skills /root/autoWrite/unified-skills-platform 3021"
    exit 1
fi

echo "Deploying $APP_NAME from $APP_DIR on port $APP_PORT"

# Stop old process
pm2 delete $APP_NAME 2>/dev/null

# Install and build
cd $APP_DIR
npm install
npm run build

# Start
PORT=$APP_PORT pm2 start 'npm start' --name $APP_NAME
pm2 save

# Reload nginx
nginx -s reload

echo "Deployed $APP_NAME"
pm2 list | grep $APP_NAME
```

使用：
```bash
chmod +x deploy.sh
./deploy.sh unified-skills /root/autoWrite/unified-skills-platform 3021
```
