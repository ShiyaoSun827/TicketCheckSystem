# Final Report

## 1. Team Information

| Team Member | Student Number | GitHub Account(s) |
| --- | --- | --- |
| Zheyuan Cong | 1010309220 | fly-ing-fish |
| Mingtao Wang | 1011777579 | superw23 |
| Lisa Ji | 1006093843 | lisaaaa912,lisaAA912 |
| Shiyao Sun | 1006769793 | ShiyaoSun827 |

## 2. Motivation

Managing event ticketing is a non-trivial task that involves multiple stakeholders: event organizers who create and manage shows, attendees who purchase tickets and attend events, and staff members who handle check-ins and on-site coordination. Traditional ticketing platforms such as Eventbrite and Ticketmaster, while widely used, come with several significant drawbacks. These include high service fees, limited flexibility in customization, inadequate real-time functionalities, and unintuitive interfaces for both attendees and staff. As such, there is a strong need for a more streamlined, cost-effective, and fully integrated solution tailored specifically to real-world venues like cinemas, university events, and local performances.

Our team identified several limitations in existing solutions that directly impact user experience and business efficiency. For example, most current systems lack a real-time check-in mechanism that syncs across devices, making them prone to duplicate entries and delays. Moreover, ticket refund systems are often rigid, non-automated, or absent altogether, leaving both users and organizers frustrated in cases of cancellations or reschedules. These gaps are particularly problematic for smaller event hosts, who may not have the resources to afford expensive third-party platforms, yet still require robust, scalable systems for ticketing, payment, and check-in.

To address these challenges, we built an end-to-end event ticketing and QR code-based check-in system using modern web technologies such as React (Next.js), Prisma, PostgreSQL, and WebSocket. This system enables users to browse movies, select seats through an interactive UI, make payments via a simulated wallet system, receive digital tickets with embedded QR codes, and check in via either desktop or mobile clients. Additionally, it supports an admin dashboard for managing movies, shows, users, refunds, and real-time statistics, as well as a staff panel for on-site seat validation and entry tracking.

Our objective was not only to meet the technical expectations of the course (authentication, API interaction, database modeling, file handling, and live updates), but to also create a fully operational product that mimics real-world cinema ticketing workflows. By combining design, engineering, and user experience principles, we aimed to deliver a project that is robust, extendable, and ready for production deployment.

### **1.1 Target Users**

This project serves three major user roles, each of which has been carefully considered in our system design:

- **Event Organizers (Admins)**: These users can log into an administrative interface to manage movies, shows, seating plans, and refund requests. They have access to powerful tools for analytics, user role assignment, and content uploads (e.g., movie posters).
- **Attendees (Users)**: Logged-in users can browse upcoming movies, choose from available showtimes, reserve seats through an intuitive seat picker, make wallet-based payments, and download QR code tickets for entry.
- **Event Staff**: Staff users operate a dedicated check-in interface where they can scan QR codes from attendees and monitor real-time seat occupancy. Staff views are optimized for mobile scanning and include scheduling and check-in history views.

### **1.2 Existing Solutions & Limitations**

Although ticketing is a well-explored domain, many commercial platforms prioritize scalability and monetization over user experience and customization. After surveying existing services and identifying user complaints, we observed the following issues:

- **High Service Fees**: Commercial platforms charge up to 10–20% per transaction, which may not be sustainable for student projects, non-profits, or small theaters.
- **Static Seating Interfaces**: Many platforms lack an interactive seat selection system, relying instead on static dropdowns or server-generated PDFs.
- **No Real-Time Check-in Syncing**: Staff members using handheld scanners often cannot verify whether a seat has already been checked in on another device, leading to duplicate entries.
- **Complex Refund Workflows**: Users often need to email customer service to request refunds, which are then manually processed over several days.
- **Minimal Role Customization**: Most systems lack fine-grained permission models, which limits their flexibility across diverse user types such as volunteers, temporary staff, or instructors.
- **Poor Cross-Device Support**: Systems are typically optimized for desktop, with limited functionality on mobile or tablet devices, especially in terms of check-in scanning.

### **1.3 How Our Project Solves These Issues**

We tackled the above issues directly through deliberate architectural and design decisions. The following table summarizes key challenges and how our project responds:

| **Key Problem** | **Our Solution** |
| --- | --- |
| High third-party fees | A self-hosted ticketing system with full control over pricing and zero service fees |
| Limited seat selection interfaces | A fully interactive seat picker component using real-time seat availability |
| Duplicate/inefficient check-ins | QR code check-in with real-time WebSocket sync across all staff devices |
| Refund complexity | A one-click refund interface for users, with automated ticket deactivation and wallet credit |
| Rigid user roles | A role-based access control system supporting Admin, Staff, and User roles |
| Lack of mobile optimization | Mobile-first responsive design and Cloudflare Tunnel integration for device testing |

### **1.4 Why This Project Is Worth Pursuing**

This project goes beyond a traditional academic web application by addressing real-world scalability, reliability, and user-experience challenges. It introduces components such as:

- **Live ticketing logic and concurrency control**, which ensures no seat is double-booked even under concurrent operations.
- **Secure wallet payments**, mimicking real-life systems like Alipay balance or AMC prepaid tickets, which can be integrated with real payment providers in the future.
- **Dynamic QR code generation and scanning**, providing a realistic simulation of entry management seen in venues and airports.
- **Cloud storage support**, ensuring image and metadata persistence across sessions.
- **Separation of concerns**, achieved via a well-structured codebase with a clear distinction between user interfaces, API routes, database schema, and server-side logic.

Ultimately, our solution offers an excellent educational showcase of how modern web stacks can be used to build a responsive, scalable, and user-friendly system with real-world utility.

## **3. Project Objective**

The primary objective of this project is to design and implement a robust, scalable, and production-ready event ticketing platform that streamlines the entire cinema or event experience for all user roles: attendees, event organizers, and on-site staff. Rather than building a basic CRUD application, our team sought to address real-world operational challenges through thoughtful technical design and full-stack implementation.

Our platform was designed to fulfill the following core goals:

- **Multi-role Access & Permissions:**
    
    We implemented role-based access control (RBAC) to support three distinct user types—**Attendees**, **Organizers**, and **Staff**—each with customized dashboards and functionality. For example, organizers can create and manage shows and movies, approve refunds, and monitor check-in analytics, while staff can scan QR codes and validate check-ins, and attendees can view past purchases, manage their wallet, and receive ticket confirmations.
    
- **Real-Time Functionality:**
    
    Seat selection and QR-code-based check-ins are synchronized using WebSocket technology, ensuring that seats are locked instantly upon selection and validated in real time. This design minimizes race conditions, prevents double booking, and supports simultaneous access from multiple staff devices without conflict.
    
- **Secure Payment and Refund System:**
    
    A built-in **wallet system** allows users to recharge balance, pay for tickets, and receive automated refunds. Every wallet transaction is recorded and timestamped, supporting a full traceable ledger for auditing or debugging.
    
- **Data Integrity and Traceability:**
    
    All major entities—such as tickets, wallet transactions, and QR scan records—are linked via foreign keys in a well-normalized PostgreSQL schema. Each transaction, whether a purchase or refund, is accompanied by metadata (e.g., timestamps, notes), ensuring accountability and consistency across the platform.
    
- **Developer-Focused Architecture:**
    
    The backend was built using **Prisma ORM** for type-safe database access and **Next.js API routes** for streamlined RESTful endpoints. Environment variables (.env) are used for secure and flexible configuration, and all features are modularized across logical folders for maintainability and ease of collaboration.
    
- **Course-Relevant Technologies & Beyond:**
    
    While satisfying all course requirements—including authentication (Better Auth), API integration, file handling (image uploads), and real-time check-ins—we also pushed beyond the scope by incorporating advanced features such as QR-based entry logic, wallet refunds, real-time seat locks, cloud storage, and multi-device compatibility.
    
- **Secure Email-Based Identity Verification & Ticket Delivery:**
    
    Extended the authentication flow by integrating Better Auth with SMTP-based email verification. During sign-up, users receive a verification email containing a secure verification link. Until the user confirms their email, login is blocked to ensure only validated users can access the platform. In addition, after successfully purchasing a ticket, users can click a "📧 Email Ticket" button to receive their full ticket details—including the movie title, time, seat assignment, and a dynamically generated QR code image—delivered to their registered email. This enhancement improves both user trust and event-day efficiency.
    

To sum up, the goal was to build not only a technically sound project but also a deployable, extensible system that demonstrates our engineering capabilities. The system is ready to be further developed, scaled, or integrated into real business use cases, making it an ideal portfolio project for showcasing full-stack development proficiency.

## **4. Technical Stack**

To meet the project’s demand for real-time responsiveness, secure transactions, and maintainable architecture, we adopted a **separated frontend and backend architecture** based on **Next.js**, with API routes acting as the backend and a client-facing frontend implemented via React. This architecture provided the scalability and flexibility necessary for managing event data, seat reservations, wallet transactions, and QR-based check-ins.

### **4.1 Frontend Technologies**

The frontend was developed using **React** in combination with **Next.js (App Router)** to support a modern routing structure and server-side rendering when needed. Key components include:

- **Next.js (App Router)**: Chosen for its full-stack capabilities and modern routing API that simplifies layout nesting, dynamic pages, and server-side operations.
- **Tailwind CSS**: Used for rapid UI development with utility-first styling, ensuring responsiveness across desktop and mobile views.
- **Socket.IO Client**: Integrated to enable **real-time QR check-ins**, **seat state synchronization**, and **live dashboard updates** without page refresh.
- **ShadCN UI & Custom Components**: Provided design consistency and accessibility while maintaining performance and maintainability.
- **Cloudflare Tunnel for Testing**: Used to expose the local server to mobile devices during development, particularly for staff-side QR scanning and check-in pages.

The frontend also includes role-specific dashboards:

- **User Dashboard**: View orders, wallet, tickets, and refunds.
- **Admin Dashboard**: Manage movies, shows, users, analytics.
- **Staff Dashboard**: Scan QR codes and view real-time check-in records.

### **4.2 Backend Technologies**

The backend was implemented using **Next.js API routes** with a strong emphasis on modularity, security, and real-time features.

- **Prisma ORM + PostgreSQL**: Prisma offers type-safe and declarative interaction with our PostgreSQL database. The schema was modeled with clear relational structures, including foreign keys between `User`, `Ticket`, `Show`, `Order`, `Wallet`, `QRScanRecord`, and more.
- **Better Auth**: Chosen for simplified session and token management in Next.js projects. It provides a secure and extensible authentication system that supports role-based access (User, Staff, Admin). We extended its default behavior with **SMTP-based email verification using Nodemailer**, requiring users to verify their email before logging in.
- **Socket.IO (WebSocket)**: Enables **real-time communication**, such as syncing seat availability and check-in status across devices, improving the system’s responsiveness and concurrency control.
- **bcrypt**: Used for password hashing to ensure secure credential storage.
- **RESTful APIs**: Structured, reusable endpoints for ticket purchase, wallet updates, refund processing, and QR validation.
- **Custom Middlewares**: Applied for authentication validation, role checking, and centralized error handling.
- **Cloud Storage Integration**: Used for managing static assets like movie posters via accessible image URLs.
- **Environment Configuration**: Environment variables (`.env`) manage sensitive credentials and configuration per environment.

### **4.3 Why This Stack Was Chosen**

Our technology choices were guided by the following considerations:

- **Scalability**: By separating frontend and backend concerns, we ensured the architecture could scale horizontally and support future microservices (e.g., for email dispatch or analytics).
- **Developer Experience**: Prisma and Next.js App Router offered strong TypeScript support, hot reloading, and clean project structure, which improved productivity during team collaboration.
- **Real-time Functionality**: Socket.IO allowed us to implement **low-latency seat locking and QR check-ins**, critical for preventing race conditions during ticket sales and validating entries.
- **Security**: Authentication, session validation, and payment simulation were built with robust practices to protect user data and enforce access rules.

This stack ensured our system could meet not only the course requirements—such as authentication, real-time backend communication, file handling, and API integration—but also deliver a product that feels close to production quality.

---

## **5. Key Features**

Our system implements all core functionalities expected of a professional event ticketing solution, with real-time synchronization, secure role-based access control, and a streamlined user experience across desktop and mobile.

### **5.1 User Authentication and Role Management**

Our authentication system is built using **Better Auth**, a robust and extensible library tailored for Next.js applications. It enables secure user sign-up, login, and role-based session handling across all user types (User, Staff, Admin). The system also includes the following features:

- **Role Selection at Sign-Up**: During registration, users can select their role (User or Staff), which is stored in the database and determines their dashboard access upon login.
- **Email + Password Sign-Up**: New users register with a name, email, and password. All credentials are validated on the client and server side, and securely stored using bcrypt hashing through Better Auth and Prisma.
- **Email Verification (SMTP)**: We extended Better Auth by integrating **SMTP-based email verification using Nodemailer**. Upon sign-up, users receive a verification email containing a secure link. The system stores the `emailVerified` flag in the database and blocks login attempts until the user has verified their email.
- **Session Cookie-Based Login**: After successful sign-in and verification, a secure cookie is set in the browser using Better Auth’s built-in session handling. This allows protected pages (like dashboards) to dynamically load user-specific content using `auth.api.getSession()`.
- **Role-Based Redirect After Login**: The system checks the authenticated user’s role (`User`, `Staff`, or `Admin`) and dynamically redirects them to the correct dashboard (`/dashboard/user`, `/dashboard/staff`, or `/dashboard/admin`).
- **Secure API Access**: Protected API routes verify session tokens and user roles to restrict access based on permission level. Unauthorized access attempts return appropriate status codes and error messages.
- **Sign-Out Functionality**: A simple logout button on the top-right corner of each page allows users to sign out securely. This clears their session cookie and redirects them to the home page.

This authentication system ensures secure access control and enhances user trust through proper verification and session management workflows, while supporting seamless navigation between role-specific dashboards.

### **5.2 Event Creation and Ticket Management**

Users can view all movies on the homepage, add movies to the collection list and display them on the homepage, view shows that can be purchased with tickets, select the seats they want to buy, and the seat selection interface provides a user-friendly operation interface. It supports sliding batch selection and cancellation. The seat selection interface will display the operable status of the seats. Users can add the selected seats to the shopping cart or directly complete the payment in the seat selection interface. When a seat payment is successful, its status will be updated to "purchased". In the shopping cart interface, users can batch delete the previously selected seats or generate an order. In the order interface, users can view paid and unpaid orders. After successful purchase, users can view the purchased tickets in the "My Ticket" interface. Users can refund unused tickets. Users can recharge in the "My Wallet" interface and view transaction records, including recharge, payment and refund records.

The administrator can access his on the dashboard interface and view various detailed information. This includes comprehensive and detailed viewing capabilities with filtering functions for all movie records, all show records, all ticket records, and all transaction records. The administrator can add and delete movies. The administrator can modify movies on their detailed pages and add, delete, modify and query all shows associated with the movie. When creating a show, a draft will be created first and then submitted. Only the submitted shows can be viewed by users, and after submission, the shows can only be cancelled but not modified. If a show is cancelled, the corresponding ticket status will be updated to "cancel" and a refund will be made.

### **5.3 QR Code Check-in**

A central feature of our system is the ability to check in users securely at the event entrance using QR codes. Each ticket generated upon payment includes a unique QR code stored in the database (`Ticket.qrCode` field), and optionally rendered via the [qrcode](https://www.npmjs.com/package/qrcode) library.

When scanned using the **staff dashboard** or mobile scanner, the system performs **server-side validation** via a POST request to the `/api/checkin` route. This endpoint checks the following conditions:

- Whether the ticket exists
- Whether it belongs to the correct show
- Whether it has already been scanned
- Whether the status is still `VALID`

Once verified, the ticket’s `status` is updated to `CHECKED`, and the check-in record is stored in the `QRScanRecord` model for traceability, including timestamp and scanned staff identity.

To ensure **cross-device synchronization**, we use **WebSocket (Socket.IO)** to immediately broadcast the updated status to all connected clients. For example, once a staff member checks in a seat via desktop or mobile, the updated seat state is reflected in real time on other devices (e.g., admin panels, other staff dashboards), ensuring no duplicate scans or entry issues.

Additionally, the system supports:

- Displaying “already checked in” warnings for invalid tickets
- Handling corrupted or reused QR codes
- Logging all check-ins for post-event analytics

This architecture ensures high concurrency and prevents race conditions during peak entrance times at events.

### **5.4 Dashboards: Admin, Staff, and User**

To accommodate the three main user roles in the system—**Administrators**, **Staff**, and **Attendees (Users)**—we designed and implemented role-specific dashboards that expose tailored functionalities, permissions, and real-time information.

### **Admin Dashboard**

Accessible exclusively to users with the `ADMIN` role, the Admin Dashboard provides full system control and high-level event oversight. Core capabilities include:

- **Movie Management**: Admins can create, update, and delete movies, including setting attributes like title, genre, length, description, and uploading cover images.
- **Showtime Management**: Create and schedule shows with conflict detection. Each show is linked to a specific movie and has a detailed seat matrix.
- **User Management**: View all registered users, assign roles (e.g., promote to `STAFF`), and deactivate or remove accounts when needed.
- **Refund Processing**: Admins can process refunds by marking tickets as `REFUNDED`, unlocking the seat, and automatically crediting the user's wallet.
- **System Analytics**: Admins can access high-level analytics including:
    - Total revenue
    - Tickets sold per movie
    - Number of active, cancelled, or completed shows
    - Wallet transaction summaries

The admin UI is organized into navigable sections and backed by secure role-checking on both client and server.

### **Staff Dashboard**

Designed for event personnel, the Staff Dashboard enables real-time ticket validation and operational support at check-in points. It includes:

- **Check-In Panel**: Staff can scan attendee QR codes (via mobile or desktop), and verify ticket validity in real time.
- **Real-Time Synchronization**: QR scans are instantly reflected across all staff interfaces using WebSocket events, preventing double check-ins.
- **Check-In History**: Staff can view which seats have already been checked in and filter logs by showtime.
- **Today’s Show Overview**: The dashboard shows all active events for the day and links to seat status previews for each show.
- **Manual Entry Support**: If QR scanning fails, staff can manually enter ticket IDs or seat numbers to complete check-ins.

This dashboard is optimized for mobile use and supports cross-device testing via Cloudflare Tunnel integration.

### **User Dashboard**

The User Dashboard provides a clean and responsive interface for attendees to manage their activity on the platform:

- **My Tickets**: View all purchased tickets along with seat numbers, event info, QR codes, and ticket status (e.g., `VALID`, `CHECKED`, `REFUNDED`).
- **My Wallet**: Recharge balance, view wallet history, and track transactions for purchases, refunds, and recharges.
- **My Orders**: See detailed breakdowns of past orders including show details, seat selections, and total costs.
- **Favorites and History**: Users can bookmark favorite movies and track viewing history.
- **Profile Settings**: Users can update their name or email address (auth-based editing), helping ensure that contact and identity data stays current.

By separating interfaces and logic based on user role, we ensured clarity, security, and ease of use for all participants in the event ticketing workflow.

### **5.5 Real-time Check-in Dashboard**

The **Real-time Check-in Dashboard** is a dedicated admin and staff interface designed to monitor and manage user attendance for each movie screening. It provides a visual seat map with different color-coded seat statuses. Admins and staff can select a specific show and view its seat status in real time.

### **5.6 Attendance Analytics and Reporting**

In admin dashboard, the ticket management module provides administrators with insights into ticket usage and user engagement across all movie shows. It aggregates data from ticketing, check-in, and transaction records to support better operational decisions

### **5.7 Automated Email Confirmations**

To enhance user experience and reinforce transaction reliability, our system includes robust **automated email notifications** using **SMTP via Nodemailer**. These email services are triggered at key points in the user journey and dynamically populated with personalized content.

1. **Sign-Up Email Verification**

Upon registering a new account, users are required to verify their email address. This prevents fraudulent sign-ups and ensures each account is linked to a valid, accessible inbox.

- A verification email is sent immediately after sign-up.
- The message includes a secure one-time verification link.
- Clicking the link sets the `emailVerified` flag in the database and enables sign-in access.
- Until verified, users are blocked from logging in and shown a custom error message

  2.   **Ticket Confirmation Email**

After completing a ticket purchase, users can choose to **email their ticket** directly from the dashboard.

- The email includes:
    - Movie title
    - Showtime and date
    - Seat information (row and column)
    - QR code (rendered as an attached PNG image)
- The system generates the QR code dynamically using `qrcode` and attaches it inline using `cid` so it renders properly inside the email client.
- This feature helps users store, print, or access tickets even when not logged in.

### Technical Implementation

- **Transport**: Nodemailer with Gmail SMTP (via App Password)
- **Template**: Styled HTML email bodies rendered with dynamic data
- **Delivery**: Verified sender email (Gmail) with support for multiple recipients (test-compatible)
- **Attachment Handling**: QR codes embedded using `cid` so they are viewable without downloading

These email confirmations provide professionalism, convenience, and assurance that users’ transactions and accounts are handled securely.

### **5.8 Mobile-Responsive Staff Check-in Interface**

This interface allows venue staff to swiftly and reliably check-in guests using QR code scanning via mobile devices.Staff views available showtimes on their mobile device, quickly identifying the relevant movie session.Access the interactive seat map to visualize current reservations and occupancy.Initiate QR scanning mode directly within the app interface.Scan guest’s QR ticket, automatically triggering a backend API call to verify and update ticket status.Instant validation feedback is provided to the staff, while the seat map dynamically updates to reflect the newly checked-in ticket.

1. **Core Functionality**
- **Real-Time Showtimes Listing:**
    
    Staff members can view a real-time, dynamically updated list of movie showtimes, each clearly displaying key information including movie posters, titles, scheduled times, and ticket pricing. The listing is efficiently fetched from the backend API endpoint `/api/showtimes` .
    
- **Interactive Seat Map:**
    
    Selecting a specific showtime directs staff to a detailed seat map (`/showtimes/id`), visually indicating each seat's current status with intuitive color-coding.The seat status information is synchronized in real-time, ensuring accuracy and reliability during busy check-in periods.
    
- **QR Code Scanner Integration:**
    
    The interface features an intuitive QR code scanner implemented using the `expo-camera` module (`CameraView`). Staff members can efficiently validate guest tickets by scanning them with their mobile devices, which triggers an instant validation check through the `/api/checkin` endpoint.
    
1. **Technical Implementation**
- **React Native + Expo:**
    
    To achieve platform-agnostic functionality and rapid development, the mobile frontend was built using **React Native with Expo Router**. This ensures seamless deployment on both iOS and Android devices with minimal platform-specific adjustments.
    
- **Expo Router & Dynamic Routing:**
    
    Using Expo Router, dynamic routing and parameter passing (e.g., `showId`) are simplified, enabling intuitive navigation between screens (showtime listings, seat maps, QR scanner).
    
- **Real-time State Synchronization:**
    
    Leveraging the `useFocusEffect` hook ensures that seat statuses are refreshed upon each check-in event, thereby accurately reflecting the latest seat statuses without requiring manual refresh.
    
- **DigitalOcean Spaces CDN Integration:**
    
    The app intelligently handles movie posters and image assets through conditional configuration:
    
    - **Local Development:** Images are served from local storage.
    - **Production Deployment:** Images are securely fetched from DigitalOcean Spaces CDN (`https://movies-images.tor1.cdn.digitaloceanspaces.com`), ensuring fast and globally accessible asset delivery.
- **Secure QR Validation API:**
    
    The `/api/checkin` endpoint robustly validates QR codes, updating ticket statuses only if they are valid and unclaimed, thereby ensuring data integrity and preventing ticket fraud. Each check-in also triggers logging into the `QRScanRecord` database table for auditing purposes.
    

### **5.9 Cloud Storage for Event Assets**

To enhance the efficiency, scalability, and overall user experience of our application, we integrated DigitalOcean Spaces and its integrated CDN service for managing event-related assets, such as images and multimedia content.

1. **Technical Implementation**

To facilitate seamless integration, several environment variables were defined in the backend, including:

- `USE_CDN`: Toggles between local and cloud storage modes.
- `DO_SPACES_KEY` and `DO_SPACES_SECRET`: Authentication keys for securely accessing DigitalOcean Spaces.
- `DO_SPACES_BUCKET` and `DO_SPACES_REGION`: Specify the storage bucket and the geographical region for asset hosting.
- `CDN_URL` and `PUBLIC_IMAGE_BASE_URL`: Construct complete asset URLs utilized by both the backend and frontend components.

The backend upload API uses these environment variables to manage file uploads. Each uploaded file undergoes SHA256 hashing to ensure deduplication, eliminating redundant storage.

1. **Frontend Integration (Mobile and Web Interfaces)**

Our frontend interfaces (built with React Native/Expo and Next.js) use the unified environment variable (`PUBLIC_IMAGE_BASE_URL`) to seamlessly access images, whether stored locally or hosted on the cloud. This ensures a smooth and consistent user experience across platforms while significantly improving load performance.

---

## 6. User Guide

This section provides a step-by-step walkthrough for how users interact with our event ticketing platform. It is designed to ensure both new and returning users can fully utilize the system’s capabilities—from registration to ticket check-in.

---

### **6.1 Navigation Bar**

The navigation bar offers users quick access to key features based on their role and authentication status. It includes a **Home** button that redirects to the public movie listing page, accessible to all visitors. If the user has administrative privileges, an additional **Admin Dashboard** link is displayed, granting access to management tools for movies, shows, users, and system analytics. The **Dashboard** link leads authenticated users to their personal dashboard, which summarizes activity and relevant statistics.

Real-time indicators are shown next to **Cart**, **Orders**, **Tickets**, and **Wallet**, dynamically reflecting the number of items and the current wallet balance for the logged-in user. Lastly, the navigation bar adapts to session state by displaying either a **Sign In** button for guests or a **Sign Out** option alongside a personalized greeting for authenticated users.

### **6.2 Signing Up for an Account**

1. **Navigate to** `/signup`.
2. Fill in:
    - **Email Address** (must be valid; used for verification)
    - **Password** (min. 8 characters)
    - **Name** (displayed in dashboards)
3. Submit the form.
4. You will receive a **verification email** (if you selected the *User* role).
    - Click the link in the email to verify your account.
    - Only after verification can a *User* sign in.
5. Upon successful sign-up, you will be redirected to the appropriate dashboard based on your role.

---

### **6.3 Signing In**

1. Visit `/signin`.
2. Enter your registered **email** and **password**.
3. If you're a *User* and have not verified your email, the system will prevent login and prompt you to verify.
4. Upon successful login:
    - *User*: Redirected to `/dashboard/user`
    - *Admin*: Redirected to `/dashboard/admin`
    - *Staff*: Redirected to `/dashboard/staff`

---

### **6.4 Exploring Movies (Main Page)**

1. Go to `/`.
2. Browse through the list of available movies.
3. You can:
    - Use the **search box** to filter by title
    - Use pagination if there are more than 9 movies
4. Click a movie to see showtimes.

---

### **6.5 Purchasing Tickets**

1. On a movie's detail page, select a **showtime**.
2. Choose an available **seat** from the interactive seat map.
3. Click **Confirm Purchase**.
4. If you have sufficient wallet balance:
    - The ticket is issued.
    - A QR code is generated and stored.
    - You can view your ticket in the **My Tickets** section.
5. If wallet balance is insufficient:
    - Recharge your wallet from the **Wallet** section.

---

### **6.6 Viewing and Managing Tickets**

- Navigate to `/dashboard/user/myTickets`.
- Each ticket displays:
    - Movie title
    - Date & time
    - Seat info
    - QR code (if valid)
- You can:
    - Click **Refund** to request a refund if the ticket status is `VALID`.
    - Click **Email Ticket** to send the ticket (including QR code) to your email.

---

### **6.7 Wallet Management**

- Go to `/dashboard/user/wallet`.
- View your **current balance**.
- Click **Recharge Wallet** to simulate adding funds (e.g., ¥10, ¥20, etc.).
- All transactions are timestamped and shown in a ledger.

---

### **6.8 Order & Refund History**

- Visit `/dashboard/user/orders`.
- View a list of all orders:
    - Purchase date
    - Ticket status
    - Associated seats
- Refunds are automatically processed to the wallet and reflected in the balance.

---

### **6.9 Cart System (Optional)**

- Some flows include adding tickets to a cart before purchase.
- Visit `/dashboard/user/cart` to:
    - Review items
    - Remove or proceed to checkout
- Useful when selecting multiple seats or shows in one session.

---

### **6.10 Staff QR Code Check-In (Staff Role)**

1. Go to `/dashboard/staff`.
2. Use the **QR Scanner** to scan tickets upon entry.
3. The system checks:
    - Ticket status (`VALID`)
    - If already scanned (`REDEEMED`)
4. Once scanned:
    - The ticket is marked as redeemed.
    - Real-time updates are reflected in the backend.

---

### **6.11 Admin Tools (Admin Role)**

1. Access via `/dashboard/admin`.
2. Functionalities include:
    - **Create/Edit/Delete** Movies
    - **Create Showtimes** for specific movies
    - View analytics for check-ins or revenue (if enabled)
3. Admin dashboards are protected via role-based access control (RBAC).

---

### **6.12 Logging Out**

- Click **Sign Out** from the top navigation bar.
- The session token is cleared, and you are redirected to `/`.

## 7. Development Guide

Main folder structure
```
project-root
├─check_in_mobile
│  └─check-in-system
│      ├─app
│      │  ├─(tabs)
│      │  └─showtimes
│      ├─assets
│      │  ├─fonts
│      │  └─images
│      ├─components
│      │  ├─ui
│      │  └─__tests__
│      │      └─__snapshots__
│      ├─constants
│      ├─hooks
│      └─scripts
├─prisma
│  └─migrations
│      └─20250419014145_new
├─public
│  ├─images
│  └─qr
└─src
    ├─app
    │  ├─api
    │  │  ├─auth
    │  │  │  └─[...all]
    │  │  ├─checkin
    │  │  ├─showtimes
    │  │  │  └─id
    │  │  │      └─seats
    │  │  ├─signup
    │  │  ├─upload
    │  │  └─verify
    │  ├─dashboard
    │  │  ├─admin
    │  │  │  ├─manageMovie
    │  │  │  │  └─[movieId]
    │  │  │  │      └─shows
    │  │  │  ├─manageShow
    │  │  │  │  └─[showId]
    │  │  │  └─manageUsers
    │  │  ├─staff
    │  │  │  └─checkin
    │  │  └─user
    │  │      ├─cart
    │  │      ├─myTickets
    │  │      ├─orders
    │  │      └─wallet
    │  ├─movies
    │  │  └─[movieId]
    │  ├─signin
    │  ├─signup
    │  └─tickets
    │      └─[showId]
    ├─components
    │  └─ui
    ├─hooks
    ├─lib
    └─scripts
```

### **7.1. Environment Setup and Configuration**

- Ensure **PostgreSQL v16** is installed and running locally.
    - Start the database service:
        - `net start postgresql-x64-16`
- Navigate to the project root and install all dependencies:
    - `cd project-root`
    - `npm install`
- Ensure the following environment variables are set up:

**In `project-root/.env`:**

```
DATABASE_URL="postgresql://username:password@localhost:5432/paper_management?schema=public"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"

PUBLIC_IMAGE_BASE_URL="https://movies-images.tor1.cdn.digitaloceanspaces.com" 
BETTER_AUTH_SECRET=utODwsvVhC2eDYJYwZx2gE2uVufeK1a9
GMAIL_USER=fantasiapharris134@gmail.com
GMAIL_APP_PASSWORD=unlfroogjqwmzhsw

//switch -- cloud/local
USE_CDN=true
DO_SPACES_KEY=DO801NQ7TPZ2MN8DK46L
DO_SPACES_SECRET=VXYs+VmHMCkl6p47WFNExhagrOqLiaXjlMfaODGNnEk
DO_SPACES_BUCKET=movies-images
DO_SPACES_REGION=tor1
DO_SPACES_ENDPOINT=https://tor1.digitaloceanspaces.com
CDN_URL=https://movies-images.tor1.cdn.digitaloceanspaces.com
```

**In `check_in_mobile/check-in-system/.env`:**

```
DATABASE_URL="postgresql://username:password@localhost:5432/paper_management?schema=public"
EXPO_PUBLIC_API_BASE_URL="http://<your-ip>:3000"
EXPO_PUBLIC_IMAGE_BASE_URL="https://movies-images.tor1.cdn.digitaloceanspaces.com" 
BETTER_AUTH_SECRET=utODwsvVhC2eDYJYwZx2gE2uVufeK1a9
```

Replace `<your-ip>` with your actual local IP address and `<your-secret>` with a secure string.

---

### **7.2. Database Initialization**

Use the following Prisma commands in the `project-root` directory:

- `npx prisma format`
- `npx prisma migrate reset`
- `npx prisma generate`
- `npx prisma migrate dev`

If issues arise, try:

- `npx @better-auth/cli migrate`

To seed initial data (requires dev server to be running):

- All at once:
    - `./src/scripts/seed-all.bat`
- Or individually:
    
    ```
    node src/scripts/seed-admin.cjs
    node src/scripts/seed-movie.cjs
    node src/scripts/seed-show.mjs
    node src/scripts/seed-user.cjs
    node src/scripts/seed-ticket.mjs
    node src/scripts/seed-transaction.cjs
    ```
    

Default admin account:

- **Email**: `admin@example.com`
- **Password**: `admin123`

---

### **7.3. Cloud Storage Configuration**

- This project uses **local hosting for file and image assets** under `PUBLIC_IMAGE_BASE_URL`.
- For deployment to cloud platforms or S3/GCS, modify `image.ts` utility logic and `.env` base URLs accordingly.
- Image files (e.g., movie posters) are uploaded through admin panel and stored in `/public/uploads`.

---

### **7.4. Local Development and Testing**

- To run the Next.js development server:
    - `npm run dev`
- Mobile access via **Cloudflare Tunnel**:
    - Install tunnel:
        - `npm install -g cloudflared`
    - Start tunnel:
        - `cloudflared tunnel --url http://localhost:3000`
    - Use the public link on mobile for live testing.
- For mobile QR check-in system (React Native with Expo):
    - Navigate to:
        - `project-root/check_in_mobile/check-in-system`
    - Install:
        - `npm install`
    - Start app:
        - `npx expo start --clear`
    - Scan QR code using **Expo Go** app on your phone.

### **7.4. Email Verification (SMTP Setup)**

To enable sign-up email verification, configure Gmail SMTP by adding the following variables to your `.env` file in `project-root/.env`:

```
env
CopyEdit
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-digit-app-password

```

To generate the app password:

1. Enable **2-Step Verification** on your Gmail account.
2. Visit: https://myaccount.google.com/apppasswords
3. Choose “Mail” as the app and “Other” as the device.
4. Copy the generated password and paste it into `.env`.

Once set, this configuration enables:

- Sending email verification after sign-up (for users only).
- Email delivery for ticket confirmation after purchase.

The sending logic is handled via `src/lib/email.ts` using Nodemailer.

## 8. **Individual Contributions**

### **Zheyuan Cong – Event Management & Seat Selection**

- Designed and implemented the event creation and management UI for organizers.
- Developed the seat selection component with real-time availability and locking via WebSocket.
- Integrated the event creation flow with backend APIs and seat layout schemas.
- Contributed to styling and UI consistency across major pages using Tailwind CSS.
- Refined organizer-specific features such as movie listing, showtime creation, and validations.
- Developed the virtual wallet system, including balance recharge, transaction logging, and deductions.

### **Mingtao Wang – User Dashboard & Check-in System**

- Built the full-featured staff and admin dashboard, including QR code checkin feature, checkin history, recent sessions and so on.
- Designed and implemented the admin and staff dashboard for real-time QR code check-in and schedule display.
- Integrated WebSocket for real-time seat status sync and QR code scanning functionality.
- Refactored and internationalized user-facing pages to improve clarity and maintainability.
- Integrated wallet usage during checkout, handling payment success/failure and refunds.

### **Lisa Ji – Authentication & Wallet/Payment System**

- Implemented the full user authentication flow using BetterAuth, including signup, login, and role assignment.
- Implemented cookie-based token storage and custom session validation to prevent unauthorized access. Configured token payload and middleware integration for consistent session access across server and client components.
- Integrated email verification using Gmail SMTP and Nodemailer.
- Implemented a keyword-based movie search system with pagination.
- Set up security measures including hashed password storage (bcrypt) and session management.
- Designed the data model for wallet transactions, user credentials, and related API logic.

### **Shiyao Sun – Order System, Admin Tools & Analytics**

- Led the design and implementation of the order management system, including shopping cart, checkout, and ticket issuance.
- Developed the admin dashboard for managing movies, showtimes, users, and refund approvals.
- Integrated analytics components such as user statistics, ticket sales summaries, and check-in history.
- Handled backend logic for multi-step ordering, QR-based ticket validation, and seat reservation enforcement.
- Managed the overall schema evolution and seeded development data for testing scenarios.

## 9. **Lessons Learned and Concluding Remarks**

### Full-Stack Development Practice

We built a complete web application using **Next.js**, **Prisma**, and **PostgreSQL**, learning how to structure frontend and backend codebases in a scalable and maintainable way. This gave us valuable experience in building real-world systems from scratch.

### Real-Time System Design

By implementing **WebSocket-based seat locking** and **QR code check-in**, we learned how to handle concurrency, avoid race conditions, and synchronize state across multiple clients—important skills for systems requiring real-time interactions.

### Secure Authentication and Authorization

Using **BetterAuth** and implementing **role-based access control (RBAC)** helped us gain a practical understanding of secure session management, password hashing, and multi-role permissions—critical in any data-sensitive application.

### Team Collaboration & Git Workflow

We collaborated using **feature branches**, **pull requests**, and **upstream merges**, simulating a professional development workflow. This improved our communication and code coordination skills.
