# To-Do List

~~区分管理员账号和普通账号~~

~~实现登录的session~~

~~电影的增删改查~~

~~Show 的增删改查~~

~~模拟支付系统和账单系统，使用代币，用户钱包页面~~

~~订单系统、购物车结算~~

~~出票系统--整合二维码~~

~~用户的收藏夹功能？收藏想看的电影~~

~~用户在自己的主页改名字、邮箱~~

~~基础的退票~~




- [ ] 上传头像
- [ ] 工单系统
- [ ] 管理员功能扩充
- [ ] 美化一下login页面

- [ ] 各种staff界面（重量级）
- [ ] 出票系统--通过邮箱下发ticket？
- [ ] 登录系统--提供修改邮箱、验证邮箱功能（要查better auth文档


- 启动 PostgreSQL 服务：net start postgresql-x64-16 （使用postgresql16）

- 安装依赖
```
cd \project-root\
npm install
```

- 更新数据库
```
npx prisma format (有时候数据库大改了就需要先跑这个)
npx prisma migrate reset
npx prisma generate
npx prisma migrate dev 
```

- 有时候突发恶疾的话可以试一下这个`npx @better-auth/cli migrate` (忘了这一行要不要跑了)

- 自动创建初始管理员、添加一些电影、添加一些show的脚本（这些脚本都要npm run dev之后运行，因为直接用的prisma的方法）

- 管理员账号： admin@example.com admin123

- 运行所有seed脚本：
`TicketSystem\project-root> ./src/scripts/seed-all.bat`

```
node src/scripts/seed-admin.cjs
node src/scripts/seed-movie.cjs
node src/scripts/seed-show.mjs
```

- git命令（老是忘）
```
git remote add upstream <upstream仓库链接>
git remote -v
git remote set-url upstream <新的仓库链接>

git push upstream main 把main分支推到upstream仓库

git fetch upstream
git merge upstream/main     更新合并到你当前所在的 main 分支

（git pull upstream main）

```



** 增加了 手机端scanner的功能 **
- Note: 注意在这个分支下的 project-root/src/app/api/checkin/route.ts 的api被修改。现在该API被用于手机端和后端数据库的交互。
```
cd project-root
cd check_in_mobile
cd check-in-system 
```
如果没有安装react-native/expo的按照以下步骤安装
```
npm install
```
```
npx expo start --clear
```
- Note:如果需要测试手机端，从Apple store或者Google store上下载 Expo Go
- npx expo start --clear 该指令会生成一个二维码，用手机相机扫描即可

  ** 关于配置环境 **
  - 该.env文件应置于project-root/check_in_mobile/check-in-system文件夹下
```
DATABASE_URL="postgresql://username:password@localhost:5432/paper_management?schema=public"

EXPO_PUBLIC_API_BASE_URL="http://ip地址:3000"

BETTER_AUTH_SECRET=utODwsvVhC2eDYJYwZx2gE2uVufeK1a9
```

- 该.env文件应置于project-root文件夹下
```

DATABASE_URL="postgresql://username:password@localhost:5432/paper_management?schema=public"

NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
PUBLIC_IMAGE_BASE_URL= "http://ip地址:3000"

BETTER_AUTH_SECRET=utODwsvVhC2eDYJYwZx2gE2uVufeK1a9
```

