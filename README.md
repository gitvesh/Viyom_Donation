# Viyom_Donation
Trasparent Donation
📘 PROJECT MASTER DOCUMENT

Siddhgiri Math Blockchain-Based Donation & Fund Allocation System

1️⃣ PROJECT OVERVIEW
📌 Project Title

Blockchain-Based Transparent Donation & Fund Allocation System for Siddhgiri Math, Kolhapur

🎯 Objective

To build a centralized web-based donation platform for Siddhgiri Math that ensures complete transparency and trust by recording donations and fund allocations on a blockchain ledger.

2️⃣ PROBLEM STATEMENT

Traditional donation systems lack:

Transparency in fund usage

Trust in fund allocation

Donor-level visibility

Donors cannot track how their money is actually used.

3️⃣ SOLUTION OVERVIEW

Our system:

Centralizes donation management

Uses Razorpay for payments

Uses Blockchain only for transparency

Not decentralized

Provides donor-wise fund usage tracking

4️⃣ SYSTEM SCOPE (FREEZE THIS)
Item	Status
Organization	Only Siddhgiri Math
Admin Control	Centralized
Blockchain Role	Transparency only
Payment	Razorpay
Notifications	Twilio
Decentralization	❌ No
5️⃣ SYSTEM ARCHITECTURE
Frontend (Web / Mobile)
        ↓
Spring Boot Backend
        ↓
MySQL Database
        ↓
Blockchain Ledger (Hashes Only)

6️⃣ USER ROLES
🧑‍💼 Admin

Manage sectors & pools

Allocate funds

View reports

Maintain audit logs

🧑‍🤝‍🧑 Donor

Donate funds

Track donation usage

Verify blockchain hashes

7️⃣ MODULE BREAKDOWN
1️⃣ Authentication Module

Admin & donor login

JWT security

2️⃣ Donation Module

Sector-based pools

Razorpay integration

Donation recording

3️⃣ Blockchain Transparency Module

Hash generation

Immutable records

4️⃣ Fund Allocation Module

Admin allocates funds

Donor share calculation

5️⃣ Notification Module

SMS alerts via Twilio

6️⃣ Reporting & Audit Module

Dynamic reports

Admin action logging

8️⃣ COMPLETE DATA MODEL (ER SUMMARY)
🔑 Key Entities

Organization

Admin

Donor

Sector

DonationPool

PaymentOrder

PaymentTransaction

Donation

BlockchainTransaction

FundAllocation

DonorAllocationShare

Beneficiary

Notification

Report

AuditLog

📌 This ER is frozen and must not be changed.

9️⃣ CORE BUSINESS FLOWS
🔁 Donation Flow

Donor selects sector & pool

PaymentOrder created

Razorpay payment

PaymentTransaction saved

Donation created

Blockchain hash stored

Notification sent

🔁 Fund Allocation Flow (CRITICAL)

Admin allocates funds

Pool balance updated

DonorAllocationShare calculated

Blockchain hash stored

Donors notified

🔗 Blockchain Usage (IMPORTANT)
What is stored?

Donation hash

Fund allocation hash

What is NOT stored?

PAN

Phone

Amount details

10️⃣ PAYMENT INTEGRATION (RAZORPAY)
Component	Purpose
PaymentOrder	Payment intent
PaymentTransaction	Actual payment
Donation	Business record
11️⃣ NOTIFICATIONS (TWILIO)
Triggers:

Donation success

Fund allocation usage

📌 Async & non-blocking

12️⃣ REPORTING STRATEGY

Reports are generated dynamically

Only metadata stored

Export as PDF / CSV

13️⃣ SECURITY CONSIDERATIONS

JWT authentication

Password hashing (BCrypt)

Role-based access

Blockchain immutability

14️⃣ TESTING STRATEGY

Unit testing

Integration testing

Payment testing

Allocation accuracy testing

15️⃣ FUTURE ENHANCEMENTS

Mobile app

WhatsApp notifications

Multi-organization support

AI-based fraud detection

16️⃣ DOCUMENTS TO SUBMIT
Document	Purpose
SRS	Requirements
ER Diagram	Data design
SQL Schema	DB design
HLD / LLD	Architecture
Test Report	QA
Final Report	Submission
