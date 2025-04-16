# To-Do List

~~区分管理员账号和普通账号~~

~~实现登录的session~~

~~电影的增删改查~~
~~Show 的增删改查~~

- [ ] 模拟支付系统和账单系统，使用代币
- [ ] 订单系统、购物车结算
- [ ] 出票系统--整合二维码
- [ ] 用户的收藏夹功能？收藏想看的电影
- [ ] 用户在自己的主页改名字、邮箱，上传头像
- [ ] 美化一下login页面


*启动 PostgreSQL 服务：net start postgresql-x64-16 （使用postgresql16）

*安装依赖
```
cd \project-root\
npm install
```

*更新数据库
```
npx prisma format (有时候数据库大改了就需要先跑这个)
npx prisma migrate reset
npx prisma generate
npx prisma migrate dev 
```

有时候突发恶疾的话可以试一下这个`npx @better-auth/cli migrate` (忘了这一行要不要跑了)

*自动创建初始管理员、添加一些电影、添加一些show的脚本（这些脚本都要npm run dev之后运行，因为直接用的prisma的方法）

管理员账号： admin@example.com admin123

```
node src/scripts/seed-admin.cjs
node src/scripts/seed-movie.cjs
node src/scripts/seed-show.mjs
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
