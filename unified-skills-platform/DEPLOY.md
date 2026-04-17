# 部署文档

## 服务器信息

- 服务器: 47.112.29.121
- 用户: root
- SSH密钥: ~/.ssh/id_ed25519
- PM2服务名: unified-skills
- 部署路径: /root/autoWrite/unified-skills-platform/.next/standalone/

## 部署流程

### 1. 本地构建

```bash
cd unified-skills-platform

# 清理旧的构建（如果存在）
rm -rf .next

# 构建项目
npm run build
```

### 2. 打包（注意：standalone构建不包含static目录，需要手动复制）

```bash
# 复制static目录到standalone构建
cp -r .next/static .next/standalone/.next/

# 打包
cd .next/standalone
tar -czf /tmp/unified-skills-deploy.tar.gz .
```

### 3. 上传到服务器并重启

```bash
# 上传
scp -i ~/.ssh/id_ed25519 /tmp/unified-skills-deploy.tar.gz root@47.112.29.121:/tmp/

# SSH到服务器，删除旧文件，解压新文件
ssh -i ~/.ssh/id_ed25519 root@47.112.29.121 "\
  rm -rf /root/autoWrite/unified-skills-platform/.next/standalone/* && \
  tar -xzf /tmp/unified-skills-deploy.tar.gz -C /root/autoWrite/unified-skills-platform/.next/standalone/ && \
  pm2 restart unified-skills \
"

# 检查服务状态
ssh -i ~/.ssh/id_ed25519 root@47.112.29.121 "pm2 list unified-skills"
```

### 4. 验证部署

在浏览器无痕窗口访问: http://47.112.29.121/unified-skills/

## 快速部署命令（一条命令完成）

```bash
cd unified-skills-platform && \
npm run build && \
cp -r .next/static .next/standalone/.next/ && \
cd .next/standalone && \
tar -czf /tmp/unified-skills-deploy.tar.gz . && \
scp -i ~/.ssh/id_ed25519 /tmp/unified-skills-deploy.tar.gz root@47.112.29.121:/tmp/ && \
ssh -i ~/.ssh/id_ed25519 root@47.112.29.121 "\
  rm -rf /root/autoWrite/unified-skills-platform/.next/standalone/* && \
  tar -xzf /tmp/unified-skills-deploy.tar.gz -C /root/autoWrite/unified-skills-platform/.next/standalone/ && \
  pm2 restart unified-skills \
"
```

## 常见问题

### 端口被占用 (EADDRINUSE)

如果重启失败显示端口被占用，先杀掉占用进程：

```bash
ssh -i ~/.ssh/id_ed25519 root@47.112.29.121 "fuser -k 3021/tcp; pm2 restart unified-skills"
```

### 检查日志

```bash
ssh -i ~/.ssh/id_ed25519 root@47.112.29.121 "pm2 logs unified-skills --lines 20"
```
