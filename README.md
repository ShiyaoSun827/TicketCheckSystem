## To-Do List

### ✅ Completed Features

- Role-based access control: Admin vs. Regular User
- Session-based login system
- Full CRUD operations for movies
- Full CRUD operations for showtimes
- Simulated payment and billing system using tokens; includes user wallet interface
- Shopping cart system with checkout flow
- Ticket issuance with integrated QR code
- Favorites feature: users can bookmark preferred movies
- User profile updates: name and email
- Basic refund mechanism for valid tickets

### 🔧 Upcoming / Planned Features

- Avatar upload support
- Customer support ticket system
- Enhanced admin panel with more granular controls
- UI/UX improvements on the login page
- Full-featured staff dashboard
- Email-based ticket delivery
- Login system improvements including email update and verification (BetterAuth integration required)

---

## ⚙️ Project Setup Guide

**Start PostgreSQL (for version 16) in Windows CMD:**

`net start postgresql-x64-16`

**Install Dependencies:**

Navigate to the `project-root` directory and install packages:

`cd project-root`

`npm install`

**Database Migration Workflow:**

```
npx prisma format
npx prisma migrate reset
npx prisma generate
npx prisma migrate dev
```

If any issues occur, try running:

`npx @better-auth/cli migrate`

---

## 🌱 Seeding Initial Data (Requires Dev Server Running)

To automatically populate the system with mock data, use the following scripts:

**Run All Seeds Together:**

`./src/scripts/seed-all.bat`

**Or Run Individually:**
```
node src/scripts/seed-admin.cjs
node src/scripts/seed-movie.cjs
node src/scripts/seed-show.mjs
node src/scripts/seed-user.cjs
node src/scripts/seed-ticket.mjs
node src/scripts/seed-transaction.cjs

```

Default Admin Account:

Email: admin@example.com

Password: admin123
---

## 🛠️ Common Git Commands

Add upstream for syncing:

`git remote add upstream <upstream repository URL>`

Check remotes:

`git remote -v`

Change upstream remote if necessary:

`git remote set-url upstream <new URL>`

Push main branch to upstream:

`git push upstream main`

Pull and merge from upstream into local main branch:

`git fetch upstream`

`git merge upstream/main`

Alternatively:

`git pull upstream main`

---

## 📱 Mobile Access to Localhost via Cloudflare Tunnel

To access your development environment on mobile (localhost:3000), use Cloudflare Tunnel.

**Steps:**

1. Install Cloudflared:

   `npm install -g cloudflared`

2. Start your local development server:

   `npm run dev`

3. Open a new terminal and run:

   `cloudflared tunnel --url [http://localhost:3000](http://localhost:3000/)`

4. Cloudflare will generate a public URL

   `Copy the link and open it in your phone browser`

   Alternatively, generate a QR code from this URL for scanning


**Notes:**

- The tunnel URL is temporary and changes every time
- For best performance, ensure both PC and phone are on the same Wi-Fi
- Not recommended for production deployment

---

## 📲 React Native Mobile QR Scanner (Check-in App)

Navigate to:

`project-root/check_in_mobile/check-in-system`

Install dependencies:

`npm install`

Start the app via Expo:

`npx expo start --clear`

Use the QR code generated to open the app in **Expo Go** on your phone

---

## 🔐 Environment File Configuration

Create a `.env` file in the following two directories:

**For React Native:**

Path: `project-root/check_in_mobile/check-in-system`

Content:

`DATABASE_URL = "postgresql://username:password@localhost:5432/paper_management?schema=public"`

`EXPO_PUBLIC_API_BASE_URL = "http://<your-ip>:3000"`

`BETTER_AUTH_SECRET = <your-secret>`

**For Next.js App:**

Path: `project-root`

Content:

`DATABASE_URL = "postgresql://username:password@localhost:5432/paper_management?schema=public"`

`NEXT_PUBLIC_API_BASE_URL = "[http://localhost:3000](http://localhost:3000/)"`

`PUBLIC_IMAGE_BASE_URL = "http://<your-ip>:3000"`

`BETTER_AUTH_SECRET = <your-secret>`