# Viyom DevOps End-to-End Free Deployment Guide
This guide provides an absolute, step-by-step production-grade deployment process for the **Viyom – Transparent Blockchain-Based Donation & Fund Allocation Platform**. It uses **100% free cloud services** and requires no credit card verification.

---

## ── OVERVIEW OF THE FREE CLOUD ARCHITECTURE ──

```
[Vercel Global CDN (Frontend)] 
      |
      | HTTPS (REST API calls)
      v
[Render Free Web Service (Backend)] 
      |
      |-- (JDBC SSL) ------------> [Aiven Free Cloud (MySQL 8.0 Database)]
      |-- (JSON-RPC) ------------> [Alchemy Polygon RPC Endpoint (Amoy Testnet)]
      v
[Client Web Browser (Receipt)] <-- (Uses client-side jsPDF; bypasses ephemeral storage)
```

---

## Step 1: Install Required Software
Ensure the following tools are installed on your local development machine:
1. **Git**: Version control client. [Download Git](https://git-scm.com/)
2. **Node.js (v18.x or v20.x)**: JS runtime with `npm`. [Download Node.js](https://nodejs.org/)
3. **Java JDK 17**: Needed to compile and run Spring Boot backend. [Download Eclipse Temurin JDK 17](https://adoptium.net/)
4. **MetaMask Extension**: Browser wallet for contract deployment and interaction. [Download MetaMask](https://metamask.io/)

Verify installations in your terminal:
```powershell
git --version
node --version
npm --version
java -version
```

---

## Step 2: Create GitHub Repository
1. Log in to your personal [GitHub Account](https://github.com).
2. Click the **+** (plus icon) in the top-right corner and select **New repository**.
3. Configure the repository:
   - **Repository owner**: Select your account.
   - **Repository name**: `Viyom_Donation`
   - **Description**: `Transparent Blockchain-Based Donation Platform`
   - **Visibility**: Select **Public** or **Private** (both are free).
   - **Initialize this repository with**: Leave all unchecked (Do NOT add README, .gitignore, or license).
4. Click **Create repository**.
5. Copy the HTTPS repository URL (which looks like `https://github.com/<your-username>/Viyom_Donation.git`).

---

## Step 3: Push Project
We will initialize Git in the project root folder and push the code.
Open PowerShell / Command Prompt and navigate to the project directory:
```powershell
cd "c:\Users\HP\Desktop\Destop\Viyom-main\Viyom-main"
```
Initialize git, add the remote origin, and push:
```powershell
# Initialize git if not already initialized
git init

# Add the remote origin (pointing to your repository)
git remote add origin https://github.com/gitvesh/Viyom_Donation.git

# Set the primary branch to main
git branch -M main

# Stage all files
git add .

# Create the commit
git commit -m "Initial commit - DevOps structure aligned"

# Push to GitHub
git push -u origin main
```

---

## Step 4: Create Required Accounts
You will need accounts on the following free hosting and infrastructure platforms:
1. **Aiven.io**: Sign up at [Aiven](https://aiven.io) for a permanent, free MySQL database.
2. **Render.com**: Sign up at [Render](https://render.com) using your GitHub account for free backend hosting.
3. **Vercel.com**: Sign up at [Vercel](https://vercel.com) using your GitHub account for free frontend React hosting.
4. **Alchemy.com**: Sign up at [Alchemy](https://alchemy.com) to get a free Polygon JSON-RPC node provider key.
5. **MetaMask**: Create a new crypto wallet in MetaMask if you don't already have one.

---

## Step 5: Set Environment Variables
These configurations must be set in the dashboards of the respective hosting providers to keep credentials secure.

### Backend (Render Web Service Environment Variables)
| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production configuration |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<AIVEN_HOST>:<AIVEN_PORT>/defaultdb?useSSL=true&requireSSL=true` | Secure JDBC connection link |
| `SPRING_DATASOURCE_USERNAME` | `<AIVEN_USER>` | Aiven database user |
| `SPRING_DATASOURCE_PASSWORD` | `<AIVEN_PASSWORD>` | Aiven database password |
| `JWT_SECRET` | `4a6b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b` | Random 256-bit secure signing key |
| `CORS_ALLOWED_ORIGINS` | `https://your-app-frontend.vercel.app` | Restricts API access to frontend URL only |
| `RAZORPAY_KEY_ID` | `rzp_test_SNXBJWvVtz8wkt` | Razorpay sandbox Client Key |
| `RAZORPAY_KEY_SECRET` | `<YOUR_RAZORPAY_SECRET>` | Razorpay sandbox API Secret |
| `BLOCKCHAIN_RPC_URL` | `https://polygon-amoy.g.alchemy.com/v2/<YOUR_ALCHEMY_KEY>` | Amoy Testnet RPC provider |
| `BLOCKCHAIN_CONTRACT_ADDRESS` | `0xC50E1D5608b2d861d3eDD0aC887d529434B9eC02` | Deployed contract address on blockchain |
| `BLOCKCHAIN_PRIVATE_KEY` | `<YOUR_METAMASK_PRIVATE_KEY>` | Private key (64 hex characters) of deployer wallet |
| `TWILIO_ACCOUNT_SID` | `<YOUR_TWILIO_SID>` | Twilio messaging account identifier |
| `TWILIO_AUTH_TOKEN` | `<YOUR_TWILIO_TOKEN>` | Twilio API authentication token |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` | Registered Twilio WhatsApp Sandbox number |

### Frontend (Vercel Environment Variables)
| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `REACT_APP_API_BASE_URL` | `https://your-app-backend.onrender.com/viyom/api` | Live backend API context endpoint |
| `REACT_APP_RAZORPAY_KEY` | `rzp_test_SNXBJWvVtz8wkt` | Public Razorpay key used for initiating checkouts |

---

## Step 6: Configure Build Settings
Configure these parameters within the provider dashboards during setup:

### A. Backend on Render (using Dockerfile)
- **Runtime Environment**: `Docker`
- **Docker Build Context**: `backend`
- **Dockerfile Path**: `backend/Dockerfile`
- **Build Plan**: `Free (512MB RAM)`

### B. Frontend on Vercel
- **Framework Preset**: `Create React App`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Development Command**: `npm start`

---

## Step 7: Configure Database (Aiven MySQL)
1. Go to the **Aiven Console**, click **Create Service**.
2. Select **MySQL** and choose the **Free** tier (AWS region `us-east-1` or `eu-west-1`).
3. Name the service `viyom-mysql-db`.
4. Wait 3–5 minutes for the status to show **Running**.
5. Locate the **Connection Information** tab:
   - **Host**: e.g., `mysql-viyom-xyz.aivencloud.com`
   - **Port**: e.g., `12345`
   - **User**: `avnadmin`
   - **Password**: Copy the generated password.
   - **Database Name**: `defaultdb`
6. Test connection locally via MySQL CLI or DBeaver:
   ```bash
   mysql -h <AIVEN_HOST> -P <AIVEN_PORT> -u avnadmin -p --ssl-mode=REQUIRED defaultdb
   ```
7. *Note*: Hibernate's automatic schema update `spring.jpa.hibernate.ddl-auto=update` is enabled in `application.properties`, meaning tables and indices will be automatically generated upon successful backend deployment.

---

## Step 8: Configure Backend
The backend utilizes Spring Boot externalized configuration. By setting environment variables matching property names (e.g., setting `SPRING_DATASOURCE_URL`), the variables will take precedence over local values defined in `application.properties`.

We configured `backend/Dockerfile` to compile and launch the application. This ensures optimized memory usage on Render:
```dockerfile
# Launch command in Dockerfile
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```
This forces JVM memory boundaries to scale dynamically within Render's 512MB limit, protecting the container from crashing with an `Out of Memory` exit code.

---

## Step 9: Configure Frontend
The React application reads the API URL from `process.env.REACT_APP_API_BASE_URL`.
To handle React Router Single Page Application (SPA) reload actions natively on Vercel without throwing `404 Not Found` errors, the repository contains a `frontend/vercel.json` file:
```json
{
  "version": 2,
  "routes": [
    { "src": "/static/(.*)", "dest": "/static/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```
Vercel reads this and automatically routes all client-side navigation paths (e.g. `/user/dashboard`, `/login`) to `index.html`.

---

## Step 10: Connect Frontend with Backend
To bind the two tiers together:
1. Wait for the backend deployment to complete on Render (Step 12).
2. Copy the backend service URL (e.g., `https://viyom-backend.onrender.com`).
3. Add `/viyom/api` to the end of the URL.
4. When configuring the Vercel deployment, paste this full string into the `REACT_APP_API_BASE_URL` environment variable:
   `https://viyom-backend.onrender.com/viyom/api`

---

## Step 11: Configure CORS (Cross-Origin Resource Sharing)
To prevent modern web browsers from blocking requests from your Vercel client application to your Render API server:
1. Copy the Vercel app URL (e.g., `https://viyom-donation.vercel.app`).
2. Go to **Render Dashboard** -> Select backend service -> **Environment** tab.
3. Edit/Add the environment variable:
   `CORS_ALLOWED_ORIGINS` = `https://viyom-donation.vercel.app`
4. Save changes. Render will automatically redeploy the backend service with updated origin restrictions.

---

## Step 12: Deploy Backend (Render)
1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `viyom-backend`
   - **Region**: Choose a region close to your database (e.g., US East Oregon or Frankfurt).
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker` *(This compiles the backend using the Dockerfile created)*
   - **Instance Type**: `Free`
5. Click **Advanced**:
   - Add all environment variables listed in **Step 5**.
6. Click **Create Web Service**.
7. Observe the build log. Render will build the Docker container and expose the application on port `8080` internally.

---

## Step 13: Deploy Frontend (Vercel)
1. Open the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** -> **Project**.
3. Import your `Viyom_Donation` repository.
4. Configure Project settings:
   - **Project Name**: `viyom-donation`
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Click Edit, select the `frontend` folder, and click Continue.
5. Expand **Environment Variables**:
   - Add `REACT_APP_API_BASE_URL` and `REACT_APP_RAZORPAY_KEY` (Step 5 values).
6. Click **Deploy**.
7. Once deployed, copy your application domain (e.g., `https://viyom-donation.vercel.app`).

---

## Step 14: Verify APIs
After both components are live, verify correct installation by executing API checks. Replace `your-app-backend` with your Render subdomain:

### A. Health Check / Public API Test
Execute a GET request using a terminal curl command:
```bash
curl -i https://your-app-backend.onrender.com/viyom/api/sectors
```
**Expected Response**: `200 OK` with JSON array of active sectors.

### B. Register Admin Account Test
Create a seed user account to test database writing:
```bash
curl -X POST https://your-app-backend.onrender.com/viyom/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"System Admin","email":"admin@viyom.org","password":"SecurePassword123","role":"ADMIN"}'
```
**Expected Response**: `200 OK` or `201 Created` with successful signup confirmation JSON object.

---

## Step 15: Fix Common Deployment Errors
### 1. Database Connection Timeout (`HikariPool-1 - Connection is not available`)
- **Reason**: Aiven MySQL rejects unsecured connections, or connection parameters are incorrect.
- **Fix**: Verify your `SPRING_DATASOURCE_URL` contains `?useSSL=true&requireSSL=true` at the end to satisfy SSL connection requirements.

### 2. Render Container Crash (`Out of Memory - OOM Killed`)
- **Reason**: Maven builder or spring application exceeded the 512MB RAM container ceiling.
- **Fix**: Verify that the backend is built using the provided multi-stage `Dockerfile`. Ensure JVM runtime flags `-XX:+UseContainerSupport` and `-XX:MaxRAMPercentage=75.0` are active to prevent memory bloat.

### 3. API Errors in Browser Console (`CORS Request Blocked`)
- **Reason**: Request origin from the browser (Vercel) was not white-listed in Spring Boot configuration.
- **Fix**: Go to Render Environment settings, ensure `CORS_ALLOWED_ORIGINS` exactly matches your Vercel domain (e.g., `https://viyom-donation.vercel.app` - no trailing slash).

### 4. Smart Contract Transaction Fails (`Insufficient Funds`)
- **Reason**: The deployer wallet (private key set in environment) does not have test MATIC on the Polygon Amoy network.
- **Fix**: Copy the wallet address corresponding to the private key and request free tokens from the [Polygon Amoy Faucet](https://faucet.polygon.technology/).

---

## Step 16: Generate Production Checklist
Before launching public testing:
- [ ] **Secrets verification**: Ensure `JWT_SECRET` is set to a long cryptographically secure key, not the default dev string.
- [ ] **SSL enforced**: Verify that database connection strings and backend endpoints use `https` and secure JDBC protocols.
- [ ] **MetaMask wallet isolation**: The wallet used for `BLOCKCHAIN_PRIVATE_KEY` must be a burner account used strictly for sandbox testnets. Never use a wallet containing mainnet assets.
- [ ] **Disable DDL updates**: Set `spring.jpa.hibernate.ddl-auto=validate` or `none` in a stable production release to prevent database modification on startup.
- [ ] **Payment Sandbox**: Verify Razorpay is set to `Test Mode`. Switch key identifiers to Live mode only when real currency processing is active.

---

## Step 17: How to Update the Project After Deployment
Both Render and Vercel are configured with automated CI/CD pipelines connected directly to your GitHub repository:
1. Make your code changes on your local machine.
2. Commit your code:
   ```bash
   git add .
   git commit -m "feat: updated donation statistics layout"
   ```
3. Push to GitHub:
   ```bash
   git push origin main
   ```
4. **Automatic Deployment**: Both Vercel and Render will detect the push to `main`, pull the updated codebase, build, and trigger a rolling update (zero downtime) automatically.

---

## Step 18: How to Rollback
If a deployment contains a bug, roll back immediately:

### A. Vercel Rollback (Instant)
1. Go to the **Vercel Dashboard** -> Click your Project.
2. Click **Deployments** tab.
3. Find the previous stable, working deployment.
4. Click the three dots `...` next to it and select **Redeploy**. Vercel will instantly route DNS traffic back to that specific build.

### B. Render Rollback
1. Go to the **Render Dashboard** -> Click your Backend Web Service.
2. Click **Events** or **Deployments** in the sidebar.
3. Identify the last successful deployment.
4. Click the options menu on it and choose **Rollback to this deploy**.

### C. Git Rollback (Revert Commit)
Revert the buggy commit locally and push:
```bash
# Revert the latest commit
git revert HEAD

# Push back to GitHub
git push origin main
```

---

## Step 19: Use Custom Domain (Optional)
To replace the default hosting domain names with a custom brand name (e.g. `viyom.org`):

### A. Add Custom Domain on Vercel (Frontend)
1. Go to **Vercel Dashboard** -> Select Project -> **Settings** -> **Domains**.
2. Type in your domain name (e.g., `www.viyom.org`) and click **Add**.
3. Log in to your domain registrar (e.g., GoDaddy, Namecheap) and configure DNS records:
   - **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com.`
   - **Type**: `A` | **Name**: `@` | **Value**: `76.76.21.21` (Vercel IP)

### B. Add Custom Domain on Render (Backend)
1. Go to **Render Dashboard** -> Select Web Service -> **Settings** -> **Custom Domains**.
2. Click **Add Custom Domain** and enter your API subdomain (e.g., `api.viyom.org`).
3. Set up the DNS record in your registrar's panel:
   - **Type**: `CNAME` | **Name**: `api` | **Value**: `viyom-backend.onrender.com` (Your Render address)
