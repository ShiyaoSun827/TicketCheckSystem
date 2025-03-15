# Intelligent Cinema Ticketing and QR Code-Based Entry Management System – Project Proposal

| Team Member | Student Number |
| --- | --- |
| Zheyuan Cong | 1010309220 |
| Mingtao Wang | 1011777579 |
| Lisa Ji   | 1006093843 |
| Shiyao Sun  | 1006769793 |
<!--

Generated with [markedpp](#markedpp). Get [nodejs](https://nodejs.org) first

1. $ npm i -g markedpp
2. $ markedpp --github -o README.md README.md

-->
<!-- !toc (minlevel=2 omit="Table of Contents") -->
- [1. Motivation and Project Objective](1.-Motivation-and-Project-Objective)
    - [1.1 Target Users](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [1.2 Existing Solutions & Limitations](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [1.3 How Our Project Solves These Issues](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [1.4 Why This Project Is Worth Pursuing](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
- [2. Architecture Approach](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [2.1 Frontend](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [2.2 Backend](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
- [3. Project Objective](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
- [4. Key Features](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.1 User Authentication and Role Management](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.2 Payment System](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.3 Seat Selection & Booking System](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.4 Order Management System](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.5 Event Management](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.6 QR Code Ticketing & Check-in](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.7 Analytics & Reporting System](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.8 Automated Email Confirmations](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.9 Waitlist Management](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.10 Cloud Storage & File Management](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.11 Advanced Features](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [4.12 Search Algorithm](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
- [5. Main Database Schema and Relationships](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
- [6. Tentative Plan](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [6.1 Backend Task](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [6.2 Frontend Task](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
    - [6.3 Collaboration Approach](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
- [7. Schedule](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
- [8. Conclusion](https://www.notion.so/Intelligent-Cinema-Ticketing-and-QR-Code-Based-Entry-Management-System-Project-Proposal-1b7377804c80805791c8e5a3f3bd2ffb?pvs=21)
<!-- toc! -->
## **1. Motivation and Project Objective**

Ticketing management is a complex process that requires coordination between organizers, attendees, and staff. Traditional event ticketing systems often face challenges in ticket sales, payment processing, attendee tracking, and on-site check-ins. Existing solutions such as Eventbrite and Ticketmaster, charge high service fees, lack real-time check-in functionality, and offer limited customization options for event organizers.

Moreover, seat selection systems in online ticketing platforms are often unintuitive, causing frustration for users trying to book specific seats. Refund policies and payment processing are also key pain points, with many platforms lacking a transparent and efficient system for handling ticket cancellations and refunds.

To address these issues, we propose building a scalable event ticketing platform that not only provides secure and flexible ticket purchasing but also integrates real-time check-in, an interactive seat selection system, automated payments and refunds, and an analytics dashboard for event organizers. Our goal is to create a cost-effective, efficient, and user-friendly solution that enhances both the organizer and attendee experience.

### **1.1 Target Users**

- **Event Organizers:** Need a streamlined system to **create events, sell tickets, manage seating, track check-ins, and analyze attendance data** without  expensive third-party platforms.
- **Attendees:** Want a **secure and flexible** ticket purchasing experience with **real-time seat selection, payment options, and QR code-based entry**.
- **Event Staff:** Require a check-in system to **quickly validate tickets**.

### **1.2 Existing Solutions & Limitations**

- **Third-party platforms** (e.g., Eventbrite, Ticketmaster) charge high service fees.
- **Manual check-ins** are inefficient and prone to errors.
- **Lack of real-time analytics** limits event planning insights.
- **Limited customization** in existing solutions restricts event-specific requirements.

### **1.3 How Our Project Solves These Issues**

| **Key Problem** | **Our Solution** |
| --- | --- |
| **High service fees** | Provide an **independent ticketing platform** without expensive third-party fees. |
| **Lack of flexible seat selection** | Implement an **interactive venue map** where users can visually select seats in real time. |
| **Slow and inefficient check-in process** | Use **QR code ticketing and real-time WebSocket updates** for instant check-ins. |
| **Payment processing and refunds** | Integrate **Stripe/PayPal** for secure payments and implement **automated refund processing**. |
| **Limited reporting and analytics** | Provide a **real-time dashboard** for organizers to **track attendance, ticket sales, and revenue**. |

### **1.4 Why This Project Is Worth Pursuing**

- **Innovative & Practical** – This project is not just a CRUD app; it incorporates **advanced technologies** such as **real-time WebSockets, cloud storage, API integrations, and interactive UI components** to create a **fully functional event ticketing solution**.
- **Real-World Application** – Many event organizers, particularly **small-to-medium businesses, and universities**, need an **affordable and customizable** ticketing solution. This system can be applied into a real business.
- **Technical Challenges** – The project covers **authentication, role-based access control, real-time updates, payment gateways, API integration**.

---

## **2. Architecture Approach (Option B: Separate Frontend & Backend)**

For a cinema ticket booking system, which involves secure payments, real-time updates, and a robust backend, Seperate Frontend and Backend provides a robust, scalable backend with external integrations and complex API interactions. Therefore, we choose to go with Separate Frontend & Backend.

### **2.1 Frontend (React + Next.js)**

- **React.js** for building an interactive user interface.
- **Redux or Zustand** for state management.
- **Tailwind CSS** for responsive and modern UI styling.
- **WebSockets (Socket.io)** for real-time check-in and ticket validation updates.
- **Mobile-first design** ensuring seamless experience for event check-ins.

### **2.2 Backend (Next.js API Routes)**

- Express.js for backend server and API handling.
- RESTful API design for structured communication between frontend and backend.
- JWT-based authentication using Passport.js for secure login and role management.
- bcrypt for password hashing and secure credential storage.
- BullMQ (Node.js) for handling background email processing tasks.
- API documentation using Swagger/OpenAPI.

## **3. Project Objective**

The primary goal of this project is to develop a scalable event ticketing platform that provides a seamless and user-friendly experience for event organizers, ticket buyers, and event staff. The platform will enable event creation, ticket purchasing, and QR code-based check-in with a strong focus on data integrity and security. The platform's design and functionality will leverage modern technologies to ensure high performance, scalability, and ease of use for both end-users and administrators. By integrating cloud storage for event assets, a secure payment system, and real-time ticketing functionality, we aim to create a comprehensive solution that meets the demands of the event management industry.

## **4. Key Features**

### **4.1 User Authentication and Role Management**

- Implement JWT-based authentication (using PyJWT, Passport.js):
    - Organizer: Create/manage events, view analytics.
    - Attendee: Purchase tickets, receive QR codes.
    - Staff: Scan QR codes, check-in attendees.
- Secure passwords with bcrypt and ensure secure session management.
- Implement RBAC to handle different user permissions (Organizer, Attendee, Staff).

### 4.2 Payment system

- Provide a secure and efficient payment service that supports various payment methods, including credit cards, PayPal, and Apple Pay.
- Handle ticket order payments, refunds, and transaction records.
- Use monitor payment status and update order status in real-time.

### **4.3 Seat Selection&Booking System**

- Real-Time Availability: Seats update dynamically as they are reserved.
- Seat Categories: Different pricing based on seat location (e.g., front row, balcony, general admission).
- Group Booking Support: Ability to select multiple seats in one transaction.
- Wheelchair Accessibility Options: Designated sections for accessibility compliance.

### 4.4 Order Management System

- The system should efficiently handle orders, including creation, processing, payment, and fulfillment.
- Support multi-user roles, including customers, administrators, and support staff.
- Provide a user-friendly and responsive interface accessible via web and mobile devices.
- Ensure scalability and high availability to handle a large number of transactions.
- Implement robust security measures to protect user and transaction data.

### **4.5 Event Management**

- Organizers can create, edit, and delete events.
- Customizable registration forms for collecting attendee details.
- Tiered ticket pricing (e.g., Early Bird, VIP, General Admission).
- Discount codes and promotional pricing.

### **4.6 QR Code Ticketing & Check-in**

- Generate secure QR codes upon ticket purchase using qrcode (Python) or QR Code APIs.
- Mobile-friendly check-in dashboard for event staff.
- Real-time validation of tickets, preventing duplicate check-ins,using WebSockets for live check-in tracking.
- Support offline check-in (cache data, sync when networking), storing data locally and syncing later.

### **4.7 Analytics & Reporting System**

- Real-time attendance tracking with check-in logs.
- Event analytics dashboard for organizers.
- Exportable reports (CSV/PDF) with attendee insights.

### **4.8 Automated Email Confirmations**

- Automate transactional emails (order confirmations, QR codes, event reminders).
- Order confirmation emails with attached QR codes.
- Implement BullMQ (Node.js) for background email processing to handle bulk sending.

### **4.9 Waitlist Management**

- If tickets sell out, users can join a waitlist.
- Automatic notification when tickets become available.
- Develop waitlist logic that automatically notifies users when tickets become available.

### **4.10 Cloud Storage & File Management**

- Store event banners, promotional images, and user-uploaded content in cloud storage (Google Cloud Storage).
- Implement automatic file compression and optimization for reducing storage costs and improving load times.
- Support backup and recovery mechanisms to prevent data loss.

### **4.11 Advanced Features (Required for Course)**

- User authentication & authorization (JWT-based access control).
- Real-time check-in system (WebSocket for live check-in updates).
- File handling & processing (Cloud storage for event images, QR codes).
- API integration (e.g., sending email confirmations via external service like SendGrid).

### **4.12 Search Algorithm**

- TF-IDF and Cosine Similarity, rank the movies based on content relevance, ensuring the most relevant movies appear at the top.
- Levenshtein Distance, handle fuzzy Matching,and handle typos in search queries.
- Naïve Bayes Classification,predict user movie preferences based on the previous searches and watch history.

## 5. Main Database schema and relationships (PostgreSQL)

**Users**

| ID | name | email | password | role | memberShip |
| --- | --- | --- | --- | --- | --- |

**Theater**

| ID | name | description | showID |
| --- | --- | --- | --- |

**Movie**

| ID | name | type | showTime |
| --- | --- | --- | --- |

**Show**

| ID | beginTime | endTime | movieID |
| --- | --- | --- | --- |

**Ticket**

| ID | userID | showID | price | seat | type | QR code |
| --- | --- | --- | --- | --- | --- | --- |

**Payment Record**

| id | user | time | payment | paymentMethod |
| --- | --- | --- | --- | --- |

**Booking Record**

| ID | userID | time | ticketID | price |
| --- | --- | --- | --- | --- |

**WaitList**

| ID | showID | userID | time |
| --- | --- | --- | --- |

**QRScanRecord**

| ID | qrCode | scanTime | status | scannedBy |
| --- | --- | --- | --- | --- |

**Primary and Foreign Keys**

| **Table** | **Primary Key (PK)** | **Foreign Keys (FK)** |
| --- | --- | --- |
| Users | ID | - |
| Theater | ID | showID → Show(ID) |
| Movie | ID | - |
| Show | ID | movieID → Movie(ID) |
| Ticket | ID | userID → Users(ID), showID → Show(ID) |
| Payment Record | ID | userID → Users(ID), bookID → Booking Record(ID) |
| Booking Record | ID | userID → Users(ID), ticketID → Ticket(ID) |
| WaitList | ID | showID → Show(ID), userID → Users(ID) |
| QRScanRecord | ID | qrCode → Ticket(QR code) |

## **6. Tentative Plan**

### **6.1 Backend Task**

**Lisa Ji: User Authentication & Payment System**

- Implement JWT-based authentication with role-based access control (Organizer, Attendee, Staff).
- Develop secure payment integration supporting credit cards, PayPal, and Apple Pay.
- Use Webhooks to handle real-time payment status updates and refunds.
- Ensure payment transaction handling (orders, refunds, real-time updates).
- Maintain compliance with PCI-DSS for payment security.

**Shiyao Sun: Order Management, QR Code System & Analytics**

- Develop the order processing system, handling ticket creation, payments, and fulfillment.
- Implement QR code generation for tickets and real-time validation at check-in.
- Build real-time analytics and reporting dashboards for event organizers.
- Support offline check-in mode, storing data locally and syncing later.
- Optimize scalability and performance to handle high traffic loads.

### **6.2 Frontend Task**

**Zheyuan Cong:  Event Management & Seat Selection**

- Create an event management UI for organizers to add, edit, and delete events.
- Implement interactive seat selection with real-time availability updates.
- Develop a responsive and user-friendly interface for ticket booking.

**Mingtao Wang: User Dashboard & Check-in System**

- Build user dashboards for attendees, organizers, and staff.
- Implement a check-in system for event staff to scan QR codes.
- Develop automated email confirmations with attached QR codes.
- Ensure cross-device compatibility (web and mobile).

### **6.3 Collaboration Approach**

- GitHub/GitLab for version control to manage codebase collaboratively.
- Backend-Frontend API Integration through well-defined RESTful endpoints.
- Testing & Debugging: Continuous testing to ensure stability before deployment.

## **7. Schedule**

### **Week 1-2: Backend Development**

- Set up Next.js with App Router
- Design database schema (PostgreSQL)
- Build  APIs
- Implement ticket purchasing & QR code generation

### **Week 3: Frontend Development**

- Develop React UI using shadcn/ui & Tailwind CSS
- Implement event browsing & registration flow
- Implement organizer dashboard

### **Week 4: Real-time Check-in & Final Enhancements**

- Implement QR code scanning & validation
- Implement real-time attendance tracking (WebSocket)
- Add analytics & reporting features

### **Final Week: Testing & Documentation**

- Conduct unit & integration tests
- Finalize README.md with setup instructions
- Record video demo

## **8. Conclusion**

This Intelligent Cinema Ticketing and QR Code-Based Entry Management System is a practical and achievable project within the course timeline. It meets all core technical requirements, including:

- **Next.js Full-Stack** (App Router, Server Components, API Routes)
- **PostgreSQL for data persistence**
- **Cloud storage for event assets**
- **User authentication & real-time functionality** (QR check-in system)

The system provides a **real-world solution** to event management challenges, focusing on usability, security, and efficiency. The well-defined scope ensures timely delivery while leaving room for future enhancements.
