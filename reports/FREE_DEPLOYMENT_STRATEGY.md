# BEST FREE DEPLOYMENT STRATEGY
## Project: Viyom – Transparent Blockchain-Based Donation & Fund Allocation Platform

This document outlines the optimal free-tier deployment architecture and step-by-step setup guides for the Viyom Full-Stack Platform.

---

## 1. PROJECT METADATA & COMPONENT DETECTION

Based on the codebase analysis, Viyom comprises the following components:

* **Frontend Framework:** React 18 (Single Page Application, built with `react-scripts`).
* **Backend Framework:** Spring Boot 3.2.2 (Java 17, Maven-managed build).
* **Database:** MySQL 8.0 (Relational Database).
* **Storage:** Local File Storage (`storage/pdfs/`). *Note: Render Free Tier uses ephemeral storage, meaning files are lost on restarts.*
* **Authentication:** Stateless JWT (verified on backend, stored in frontend `localStorage`).
* **APIs:** REST JSON endpoints, integrations with external Razorpay payment gateways and Web3j JSON-RPC calls.

---

## 2. COMPARISON OF FREE PLATFORMS

We compare available free cloud hosting options for our specific full-stack and blockchain components:

| Hosting Provider | Ideal Component | Pros | Cons | Verdict |
|---|---|---|---|---|
| **Vercel** | Frontend | Native React/Build optimization, CI/CD from Git, Free SSL, Global CDN. | Serverless function timeout 10s. | **SELECTED (Frontend)** |
| **Netlify** | Frontend | Simple drag-drop or Git CI/CD, redirects support. | Bandwidth limits (100GB/mo). | Good fallback. |
| **Cloudflare Pages**| Frontend | Unlimited bandwidth, fast globally. | Setup is slightly more complex. | Good alternative. |
| **GitHub Pages** | Frontend | 100% Free, tied directly to repo. | Lacks SPA route fallback natively (returns 404 on refresh). | Rejected. |
| **Render** | Backend | Free Web Service tier, supports native Java buildpacks, Git CI/CD. | Cold starts (15 mins sleep after inactivity). | **SELECTED (Backend)** |
| **Railway** | Backend/DB | Very fast deployment, clean UI. | No longer has a permanent free tier. | Rejected. |
| **Fly.io** | Backend | Container-native, no cold starts. | Requires credit card verification, requires Dockerfile. | Rejected. |
| **Aiven** | Database | Permanent free-tier MySQL (1GB storage, 1GB RAM). | Limited to 1 database instance per account. | **SELECTED (Database)** |
| **Supabase** | DB/Storage | Free Postgres, 1GB Storage. | Postgres only; Viyom requires MySQL. | Rejected for DB. |

---

## 3. RECOMMENDED FREE ARCHITECTURE

To deploy Viyom 100% free without credit card verification requirements and utilizing the codebase as-is:

```
[Vercel Global CDN (Frontend)] 
      |
      | HTTP (REST)
      v
[Render Free Web Service (Backend)] 
      |
      |-- (JDBC Protocol) ------> [Aiven Free Tier Cloud (MySQL 8.0)]
      |-- (JSON-RPC) -----------> [Alchemy Polygon RPC Endpoint (Amoy Testnet)]
      v
[Client Web Browser (Receipt PDF)] <-- (Uses client-side jsPDF; bypasses ephemeral storage)
```

### Why this strategy is selected:
1. **Frontend (Vercel):** The codebase already contains `vercel.json` configured for SPA routing. Vercel builds the React app natively on push.
2. **Backend (Render):** Render has native Java/Maven buildpacks. You do not need to create Dockerfiles or configure complex Kubernetes parameters. It is fully free.
3. **Database (Aiven MySQL):** Aiven offers a permanent, production-grade free MySQL database instance with 1GB storage and automatic backups. It never expires.
4. **Storage (Client-Side jsPDF):** Since Render’s free tier filesystem is ephemeral (resets daily), we bypass local disk writing by utilizing client-side PDF receipt downloads (via `jspdf` already present in `package.json`).

---

## 4. DEPLOYMENT ARCHITECTURE DIAGRAM (SEQUENCE)

```mermaid
sequenceDiagram
    participant User as Donor Browser
    participant Vercel as Vercel Host (React)
    participant Render as Render Host (Spring Boot)
    participant Aiven as Aiven MySQL (Cloud)
    participant Alchemy as Alchemy RPC (Polygon)

    User->>Vercel: Load Web UI Assets
    User->>Render: Login Request (POST /api/auth/login)
    Render->>Aiven: Fetch User Credentials
    Aiven-->>Render: Return Hashed Password
    Render-->>User: Return JWT Token

    User->>Render: Verify Payment & Record (POST /api/donations/verify-payment)
    Render->>Aiven: Save Donation Entry
    Render->>User: 200 OK (Payment Verified)
    
    Note over Render,Alchemy: Asynchronous Blockchain Sync
    Render->>Alchemy: Submit recordDonation() txn
    Alchemy-->>Render: Return Mined Transaction Hash
    Render->>Aiven: Write Transaction Hash to DB record
```

---

## 5. COMPLETE STEP-BY-STEP DEPLOYMENT FLOW

### Step 5.1: Database Setup (Aiven)
1. Sign up for a free account at [Aiven.io](https://aiven.io).
2. Create a new project and select **MySQL** as the service.
3. Choose the **Free Plan** (available in select regions like AWS `eu-west-1` or `us-east-1`).
4. Once running, copy the Service URI (which looks like: `mysql://user:pass@host:port/defaultdb?ssl-mode=REQUIRED`).
5. Extract the host, port, username, database name, and password for your environment configurations.

### Step 5.2: Backend Deployment (Render)
1. Log in to [Render.com](https://render.com) and link your GitHub repository.
2. Click **New** -> **Web Service**.
3. Select the Viyom repository.
4. Configure the Web Service settings:
   * **Name:** `viyom-backend`
   * **Language:** `Java` (Render automatically detects Maven configurations)
   * **Build Command:** `./mvnw clean package -DskipTests` (or `mvn clean package -DskipTests`)
   * **Start Command:** `java -jar target/viyom-0.0.1-SNAPSHOT.jar`
   * **Instance Type:** `Free`
5. Click **Advanced** and add the following Environment Variables:
   * `SPRING_PROFILES_ACTIVE` = `prod`
   * `SPRING_DATASOURCE_URL` = `jdbc:mysql://<AIVEN_HOST>:<AIVEN_PORT>/defaultdb?useSSL=true&requireSSL=true` (Constructed from Aiven credentials)
   * `SPRING_DATASOURCE_USERNAME` = `<AIVEN_USER>`
   * `SPRING_DATASOURCE_PASSWORD` = `<AIVEN_PASSWORD>`
   * `JWT_SECRET` = `<YOUR_SECURE_JWT_KEY>`
   * `RAZORPAY_KEY_ID` = `rzp_test_SNXBJWvVtz8wkt`
   * `RAZORPAY_KEY_SECRET` = `<YOUR_RAZORPAY_SECRET>`
   * `BLOCKCHAIN_RPC_URL` = `https://polygon-amoy.g.alchemy.com/v2/Ecooto5QXtLA10_XTBtIN`
   * `BLOCKCHAIN_CONTRACT_ADDRESS` = `0xC50E1D5608b2d861d3eDD0aC887d529434B9eC02`
   * `BLOCKCHAIN_PRIVATE_KEY` = `<NEW_SAFE_WALLET_PRIVATE_KEY>`
   * `CORS_ALLOWED_ORIGINS` = `https://viyom-donation.vercel.app` (Your Vercel URL)
6. Trigger the deployment. Once completed, copy the generated service URL (e.g., `https://viyom-backend.onrender.com`).

### Step 5.3: Frontend Deployment (Vercel)
1. Log in to [Vercel.com](https://vercel.app) and import the GitHub repository.
2. Configure project settings:
   * **Framework Preset:** `Create React App`
   * **Root Directory:** `frontend`
3. Expand **Environment Variables** and add:
   * `REACT_APP_API_BASE_URL` = `https://viyom-backend.onrender.com/viyom/api` (Render backend URL + Servlet context path `/viyom/api`)
   * `REACT_APP_RAZORPAY_KEY` = `rzp_test_SNXBJWvVtz8wkt`
4. Click **Deploy**. Vercel will build the static assets, configure the proxy rules from `vercel.json`, and expose your application globally.
