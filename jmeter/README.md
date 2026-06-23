# Viyom Platform — JMeter Performance Testing Suite
# Complete Setup & Execution Guide

## Quick Start (3 Steps)

### Step 1 — Start the Platform
```powershell
# Terminal 1: Start Backend
cd backend
.\mvnw.cmd spring-boot:run

# Terminal 2: Start Frontend (optional - not needed for JMeter)
cd frontend
npm start
```

### Step 2 — Seed Test Users
```powershell
# Wait for backend to be fully started, then:
cd csv-data
.\seed_users.bat
```

### Step 3 — Run JMeter Tests
```powershell
# Option A: Batch runner (menu-driven)
cd jmeter
.\run_tests.bat

# Option B: PowerShell runner (parameterized)
cd jmeter
.\run_tests.ps1 -Users 25 -Loops 3 -OpenReport

# Option C: Direct JMeter CLI
"C:\apache-jmeter-5.6.3\bin\jmeter.bat" -n `
  -t jmeter\viyom_load_test.jmx `
  -l results\output.jtl `
  -e -o reports\html-dashboard
```

---

## Folder Structure

```
Viyom-main/
├── jmeter/
│   ├── viyom_load_test.jmx        ← Main JMeter test plan (open this in JMeter GUI)
│   ├── run_tests.bat              ← Windows batch runner (menu-driven)
│   └── run_tests.ps1              ← PowerShell runner (parameterized)
│
├── csv-data/
│   ├── users.csv                  ← Test user credentials + donation parameters
│   ├── register_users.csv         ← Registration-only dataset
│   └── seed_users.bat             ← Batch script to pre-register all test users
│
├── results/                       ← JTL result files (auto-generated after test run)
│   └── .gitkeep
│
├── reports/
│   ├── PERFORMANCE_EVALUATION.md  ← IEEE-style academic evaluation report
│   └── html-dashboard/            ← Auto-generated interactive HTML report
│       └── index.html             ← Open in browser after test run
│
└── graphs/
    └── README_GRAPHS.md           ← Graph generation guide (matplotlib, LaTeX, JMeter)
```

---

## Test Scenarios Summary

| Scenario | Thread Group | Users | Ramp-Up | APIs Tested |
|---|---|---|---|---|
| A | Public Endpoints | 25 | 20s | GET /sectors, GET /pools/active, GET /beneficiaries |
| B | Auth Flow | 10 | 10s | POST /auth/register, POST /auth/login |
| C | Full Donor Journey | 25 | 20s | Login → Create Order → Verify → History |
| D | Admin Journey | 10 | 10s | Login → Allocations → Ledger → All Donations |
| E | Stress Test | 50 | 30s | Login → Sectors → Pools → Create Order → History |

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@viyom.com | Admin@123 |
| Donor | donor@viyom.com | donor123 |
| Test Users 1–24 | testuser{N}@viyom.com | Test@123 |

---

## JMeter Download

https://jmeter.apache.org/download_jmeter.cgi
Recommended: apache-jmeter-5.6.3.zip
Extract to: C:\apache-jmeter-5.6.3\
