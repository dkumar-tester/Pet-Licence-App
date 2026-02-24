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
  - **Step 1 – Owner:** Collect owner details (full name, primary residential address, optional secondary address for where the dog is kept, email, phone) and trigger 6-digit OTP identity verification.
  - **Step 2 – Pet:** Collect pet details exactly as defined in the Figma `Pet` step (name, species, breed, sex, age/DOB, color/markings, spay/neuter status, microchip/license fields, etc.).
  - **Step 3 – Payment:** Capture payment details and show a fee summary exactly as in the Figma `Payment` step.
  - **Validation:** Zod-based validation on each step before allowing progression.
  - **UI Source of Truth:** Layout, labels, and visual styling taken from the `pet-registration` Figma prototype (`https://stony-view-58011787.figma.site/`).
- **Identity Verification:**
  - 6-digit OTP Identity Verification.
- **Back-Office Admin:**
  - Application queue with "Review/Approve/Reject" capabilities.
  - Status-driven workflow (Submitted → Under Review → Approved → Paid → Completed).
  - Automated **Provisional License** generation (PDF/Download) upon approval.
- **Financials:** - Stripe integration for registration fees.
  - Success screen with QR code for license verification.
- **Analytics:** - Admin dashboard with monthly application metrics and status breakdowns.
- **Audit:**
  - Immutable logs for every status change and admin action.

## Next Steps
- [ ] **Infrastructure:** Setup `docker-compose` for PostgreSQL and initialize the .NET 8 Web API project.
- [ ] **Database Schema:** Define `PetApplication`, `ApplicationStatus` Enum, and `AuditLog` entities.
- [ ] **API Layer:** Implement the "Submit Application" and "Identity Verification" endpoints required by the public 3-step wizard.
- [ ] **Frontend Scaffold:** Initialize the React frontend (Vite), Tailwind CSS, and shadcn/ui theme.
- [ ] **Public UI – 3-Step Wizard:** Implement the Figma-aligned `Owner` → `Pet` → `Payment` registration wizard with:
  - Shared stepper component (3 steps, with active/completed/disabled states) at the top of the page.
  - Three form steps mirroring the Figma frames (field labels, button text, spacing, and layout).
  - Zod validation per step and progression only on valid input.
- [ ] **Admin Flow:** Build the back-office dashboard and approval logic.
- [ ] **Closing the Loop:** Integrate Stripe webhooks, license fee collection, provisional license PDF/QR generation, and success screen.