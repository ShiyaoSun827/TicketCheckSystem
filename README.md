# To-Do List

- [ ] 区分管理员账号和普通账号
- [ ] 实现登录的session
- [ ] 电影的增删改查
- [ ] Show 的增删改查
- [ ] 模拟支付系统
- [ ] 账单系统

*启动 PostgreSQL 服务：net start postgresql-x64-16 （使用postgresql16）

*安装依赖
```
cd \project-root\
npm install
```

*更新数据库
```
npx prisma migrate reset
npx prisma generate
npx @better-auth/cli migrate (忘了这一行要不要跑了)
npx prisma migrate dev 

```

（这些脚本都要npm run dev之后运行）

*自动创建初始管理员 admin@example.com admin123
```
node src/scripts/seed-admin.cjs
```
*自动添加一些电影 
```
node src/scripts/seed-movie.cjs
```

git命令（老是忘）
```
git remote add upstream <upstream仓库链接>
git remote -v
git remote set-url upstream <新的仓库链接>

git push upstream main 把main分支推到upstream仓库

git fetch upstream
git merge upstream/main     更新合并到你当前所在的 main 分支

（git pull upstream main）

```

## 📱 本地在手机访问项目（Cloudflare Tunnel 方式）

你可以使用 [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps) 在手机上访问运行在 `localhost:3000` 的本地开发页面（如扫码签到系统）。

### ✅ 步骤

1. **安装 cloudflared（仅需一次）**

```bash
bash
复制编辑
npm install -g cloudflared

```

1. **运行本地开发服务器**

```bash
bash
复制编辑
npm run dev

```

1. **开启 tunnel**

在另一个终端窗口中运行：

```bash
bash
复制编辑
cloudflared tunnel --url http://localhost:3000

```

终端会输出如下内容：

```
nginx
复制编辑
Your quick Tunnel has been created! Visit it at:
https://example-tunnel.trycloudflare.com

```

1. **在手机浏览器访问这个链接即可进行测试。**

---

### 📌 注意事项

- 这个链接是临时的，每次运行 `cloudflared` 后会重新生成。
- 手机和电脑需连接同一局域网（Wi-Fi）以减少网络阻碍。
- Cloudflare 的免费临时 tunnel 不适用于生产部署，只推荐用于开发调试用途。

---

如需自动二维码打开链接或扫码跳转，请自行生成上述链接对应的二维码用于扫码测试。