# VVITU ASSISTANCE — Your Digital Campus Guide
**Vasireddy Venkatadri International Technological University (VVITU)**

VVITU Assistance is a complete, modern, grounded digital campus guide and conversational AI assistant for students, faculty, staff, parents, and campus visitors.

---

## 1. Project Overview & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4.
- **Icons**: Lucide React.
- **Navigation**: Client-side SPA routing (`react-router-dom`).
- **Database**: Firebase Firestore (`buildings`, `floors`, `facilities`, `feedback`, `auditLogs`, `adminUsers`) with automatic fallback to local persistence when credentials are not yet configured.
- **Authentication**: Firebase Authentication with role-based access control (Master Admin, Directory Admin, Auditor) and demo profiles for evaluation.
- **Backend / Serverless**: Netlify Functions (`netlify/functions/chat.ts`).
- **AI Integration**: Grounded Retrieval-Augmented Generation (RAG) using Google Gemini API through Netlify serverless functions. Strict anti-hallucination guardrails guarantee the AI answers exclusively from verified campus records.
- **Testing**: Automated Vitest test suite executing all 15 required campus domain behavior tests.

---

## 2. Directory Structure

```
vvitu-assistance/
├── netlify/
│   └── functions/
│       └── chat.ts                  # Secure server-side Gemini function
├── firebase/
│   ├── firestore.rules              # Least-privilege Firestore security rules
│   └── firestore.indexes.json       # Composite Firestore indexes
├── scripts/
│   └── seed-campus-data.ts          # Repeatable idempotent seed script
├── tests/
│   └── unit/
│       └── domainQuestions.test.ts  # Vitest test suite (18 tests passing)
├── src/
│   ├── types/
│   │   └── campus.ts                # Domain models, roles, verification states
│   ├── data/
│   │   └── initialCampusData.ts     # Verified baseline campus records
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── config.ts            # Firebase SDK client initialization
│   │   │   ├── campusService.ts     # Building, facility, floor CRUD operations
│   │   │   ├── authService.ts       # RBAC authentication & demo accounts
│   │   │   └── auditService.ts      # Administrative audit logging
│   │   ├── feedback/
│   │   │   └── feedbackService.ts   # Community correction submission & review
│   │   ├── search/
│   │   │   └── searchEngine.ts      # Fuzzy token, abbreviation & alias matcher
│   │   └── ai/
│   │       ├── ragService.ts        # Grounded RAG retrieval & intent handler
│   │       └── geminiClient.ts      # Netlify function proxy with fallback
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Responsive header with mobile drawer
│   │   │   ├── Footer.tsx           # Verified public footer & disclaimers
│   │   │   └── VerificationBanner.tsx # Visual verification status badges
│   │   ├── search/
│   │   │   ├── SearchBar.tsx        # Search input with quick query suggestions
│   │   │   └── SearchResultCard.tsx # Detailed cards with landmarks & badges
│   │   ├── directory/
│   │   │   ├── BuildingCard.tsx     # Block card with branch badges & floors
│   │   │   └── CampusMapSchematic.tsx # Illustrative spatial block layout
│   │   ├── chat/
│   │   │   └── AskVVITUChatModal.tsx # Floating grounded conversational assistant
│   │   └── feedback/
│   │       └── ReportCorrectionModal.tsx # User correction submission modal
│   ├── pages/
│   │   ├── HomePage.tsx             # Hero, search, quick cards, building directory
│   │   ├── ExploreCampusPage.tsx    # Filterable campus blocks & schematic
│   │   ├── BuildingDetailPage.tsx   # Known branches, labs, floor layouts
│   │   ├── FacilityDetailPage.tsx   # Verified location details & landmarks
│   │   ├── DepartmentsLabsPage.tsx  # Engineering branches & lab facilities
│   │   ├── SharedFacilitiesPage.tsx # Mess, OAT, parking, utilities, hostels
│   │   ├── SearchResultsPage.tsx    # Global search with multi-select filters
│   │   ├── AskAIPage.tsx            # Full-page dedicated AI chat experience
│   │   ├── AboutPage.tsx            # Mission, verification policy, roadmap
│   │   ├── AdminLoginPage.tsx       # Secure admin sign in with demo autofill
│   │   ├── AdminDashboardPage.tsx   # Real Firestore metrics & audit log stream
│   │   ├── BuildingManagementPage.tsx # Edit blocks, floors, verification status
│   │   ├── FacilityManagementPage.tsx # Edit rooms, timings, verification status
│   │   └── FeedbackManagementPage.tsx # Review location corrections
│   ├── App.tsx                      # App router & global chat trigger
│   └── main.tsx                     # React 19 entry point
├── netlify.toml                     # Netlify build, redirects & function config
├── .env.example                     # Environment variables template
└── package.json
```

---

## 3. Verified Campus Data & Integrity Rules

Initial campus data supplied by project owners is marked as **Pending Verification** until independently audited:

1. **Loyalty Block 1**: CSM branch, Physics Lab, Chemistry Lab, CSM Computer Lab. (Floors/rooms unconfirmed).
2. **Loyalty Block 2**: CIV branch, AIDS branch, Civil Engineering Labs, Chemistry Lab, Examination Cell. (Floors/rooms unconfirmed).
3. **Loyalty Block 3**: EEE branch, EEE Labs, Store Room, EEE Computer Lab. (Floors/rooms unconfirmed).
4. **Loyalty Block 4**: MECH branch, CAI branch, Mechanical Engineering Labs, MECH Computer Lab, **Medical Room / First Aid Room (Ground Floor)**.
5. **Wisdom Block**: Administration headquarters and Central Library.
   - Ground Floor: Administration Block, Chancellor's Room, Vice Chancellor's Room, Registrar's Room, Dean of Academics, Director of Admissions, Principal/Director offices.
   - 1st Floor: Wisdom Block Seminar Hall.
   - **3rd and 4th Floors: University Central Library (across both floors)**.
6. **Honesty Block**: CSE, IT, CIC, ECE, M.Tech classes/labs, Computing Center, **SAC Room (beside Board Room, floor unconfirmed)**, Accounts Room, **Honesty Block Seminar Hall (Ground floor, opposite Accounts Room)**.
7. **Truth Block**: All 1st-year and 2nd-year academic classes and laboratories, Staff Room, **Student Hub (enclosed amphitheater visible upon entry)**.
8. **Shared Amenities**:
   - **Mess**: Between Loyalty Blocks 2 and 3. Daily reported lunch timings: 12:00 PM to 1:30 PM.
   - **Outdoor OAT**: Open Air Theatre located between Loyalty Blocks 2 and 3. *(Distinct from Student Hub inside Truth Block)*.
   - **Washrooms & Drinking Water**: Available in all blocks.
   - **Parking**: Bus Ground.
   - **Hostels**: 3 girls' hostels and 2 boys' hostels (individual locations unconfirmed).

---

## 4. How to Run Locally

### Prerequisites
- Node.js (v18+) and npm.

### Installation
```bash
# 1. Clone repository or navigate to scratch directory
cd C:\Users\gouth\.gemini\antigravity-ide\scratch\vvitu-assistance

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 5. Automated Tests

Run the test suite verifying all 15 domain questions and search behaviors:

```bash
npm test
```

### Verified Behaviors in Test Suite:
- ✓ SAC Room returns Honesty Block, beside the Board Room.
- ✓ Honesty Block Seminar Hall returns ground floor, opposite Accounts Room.
- ✓ Library returns Wisdom Block, 3rd and 4th floors.
- ✓ Mess returns reported timings of 12:00 PM–1:30 PM daily.
- ✓ Medical Room returns Loyalty Block 4, ground floor.
- ✓ Examination Cell returns Loyalty Block 2.
- ✓ Outdoor OAT returns between Loyalty Blocks 2 and 3.
- ✓ Student Hub returns inside Truth Block.
- ✓ CSE returns Honesty Block without fabricating room numbers.
- ✓ Hostels returns 3 girls' and 2 boys' without inventing locations.
- ✓ Phone numbers are not fabricated.
- ✓ Library hours are not fabricated.
- ✓ Nearest washroom query asks user's starting block.
- ✓ OAT query disambiguates Outdoor OAT vs Student Hub.
- ✓ SAC Room floor remains unknown until confirmed.
- ✓ Branch abbreviations (CSM, AIDS, CIV, EEE, MECH, CAI, IT, CSE, CIC, ECE) resolve.
- ✓ Feedback length validation.

---

## 6. Administrator Roles & Demo Access

Navigate to `/admin/login`. For local evaluation, click any demo account button to autofill credentials:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Master Admin (Full Website Access)** | `vvitu@ac.in` | `vvitu@123` | Full CRUD, verification, reset seed data, review feedback, audit logs |
| **Master Admin** | `master.admin@vvitu.edu.in` | `VVITU@Master2026` | Full CRUD, verification, reset seed data, review feedback, audit logs |
| **Directory Admin** | `directory.admin@vvitu.edu.in` | `VVITU@Directory2026` | Edit facilities, update room info, verify records, review feedback |
| **Auditor** | `auditor@vvitu.edu.in` | `VVITU@Auditor2026` | Read-only inspection of records, verification history, and audit logs |

---

## 7. Firebase & Netlify Deployment Guide

### Firebase Setup
1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore Database** in production mode.
3. Enable **Email/Password** under Authentication.
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. Seed initial campus records without duplicates:
   ```bash
   npx tsx scripts/seed-campus-data.ts
   ```

### Netlify Deployment
1. Connect your repository to Netlify.
2. In Site Settings > Environment Variables, add:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `GEMINI_API_KEY` *(Server-side only — never exposed to client)*
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Functions directory: `netlify/functions`
