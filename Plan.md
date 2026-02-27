# Project Overview: Pet Registration System

## Goal
Build a full-stack application to automate the pet registration lifecycle: from user submission and identity verification to back-office approval, payment (Stripe), and provisional license generation.

## Tech Stack (What We'll Use)
- **Frontend:** React (Vite) with **shadcn/ui** and **Tailwind CSS**.
- **Backend:** **C# .NET 8 (ASP.NET Core Web API)** following a RESTful Service-Repository pattern.
- **Database:** **PostgreSQL** (Relational data for applications, audit logs, and status tracking).
- **Payments:** **Stripe** (Integrated via webhooks for status updates).

## Core Features & Workflow
- **Public Submission (Figma-aligned 3-step wizard):**
  - **Step 1 – Owner Registration:** Collect full name, primary residential address, optional secondary address (if dog is kept elsewhere), email, and phone, then trigger 6-digit OTP identity verification.
  - **Step 2 – Pet Profile:** Collect dog's name, breed, age, color, sex (male/female), hair length (short/med/long), spayed/neutered status, clinic name, and vet name.
  - **Step 3 – Checkout / Payment:** Capture payment details (cardholder name, card number, expiry, CVC) and show a $15.00 registration fee summary.
  - **Final – Confirmation:** Display provisional license with details (License Number, Dog's Name, Owner's Name, Registration Date) and a QR code for verification.
  - **Validation:** Zod-based validation on each step before allowing progression.
  - **UI Source of Truth:** Layout, labels, and visual styling taken from the `pet-registration` Figma prototype (`https://stony-view-58011787.figma.site/`).
- **Identity Verification:**
  - 6-digit OTP Identity Verification.
- **Back-Office Admin:**
  - Application queue with "Review/Approve/Reject" capabilities.
  - Status-driven workflow (Submitted → Under Review → Approved → Paid → Completed).
  - Automated **Provisional License** generation (PDF/Download) upon approval.
- **Financials:** 
  - Stripe integration for registration fees.
- **Analytics:** 
  - Admin dashboard with monthly application metrics and status breakdowns.
- **Audit:**
  - Immutable logs for every status change and admin action.

## Next Steps
- [x] **Infrastructure:** Setup `docker-compose` for PostgreSQL (verified on port 5433) and initialized the .NET 8 Web API project.
- [x] **Frontend Scaffold:** Initialize the React frontend (Vite), Tailwind CSS, and shadcn/ui theme.
- [x] **Public UI – 3-Step Wizard:** Implemented the Figma-aligned `Owner` → `Pet` → `Payment` registration wizard along with Zod validation.
- [x] **Success Page UI:** Implemented the confirmation screen with provisional license details and QR code exactly matching Figma.
- [x] **Database Schema:** Expanded `PetApplication` and `AuditLog` entities and successfully applied the schema to the Docker database.
- [x] **API Layer:** Implemented and verified the "Submit Application" and "Identity Verification" endpoints required by the public wizard.
- [ ] **Admin Flow:** Build the back-office dashboard and application review logic.
- [ ] **Closing the Loop:** Integrate Stripe webhooks for actual payment processing and auto-generate the license PDF.