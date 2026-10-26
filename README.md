<div align="center">

# 🌱 Root (ሩት)
### Offline-First Multi-Agent Agricultural Advisory Platform for Smallholder Farmers

[![CI/CD Pipeline](https://github.com/Amanbey/Root/actions/workflows/ci.yml/badge.svg)](https://github.com/Amanbey/Root/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.28-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Ollama](https://img.shields.io/badge/AI%20Engine-Ollama%20(Local)-ff9900?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.ai/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline%20First-10b981?style=for-the-badge&logo=pwa&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

**Root** is an open-source, production-ready Progressive Web Application (PWA) designed to bridge the agricultural extension gap for smallholder farmers across Ethiopia. By combining a **collaborative 5-agent AI agronomy council**, a **100% offline-first dual engine**, and **pure trilingual localization** (English, Amharic, and Afaan Oromoo), Root delivers instant crop diagnosis and actionable organic remedies directly in rural fields — **even under total network blackout**.

[Explore Features](#-key-features) • [System Architecture](#-multi-agent-council-architecture) • [Offline Engine](#-100-offline-first-architecture) • [Getting Started](#-getting-started) • [Testing](#-testing--quality-assurance)

</div>

---

## 📖 Table of Contents

- [🌾 The Challenge & Vision](#-the-challenge--vision)
- [🤖 Multi-Agent Council Architecture](#-multi-agent-council-architecture)
- [⚡ 100% Offline-First Architecture](#-100-offline-first-architecture)
- [🌐 Trilingual Localization Engine](#-trilingual-localization-engine)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌾 The Challenge & Vision

Smallholder farmers account for more than **85% of Ethiopia's agricultural output**, cultivating vital staple crops such as Teff, Wheat, Maize, Coffee, Barley, Sorghum, and Enset. However, they routinely face devastating challenges:

- **Crop Pathogen Outbreaks**: Rapidly spreading blights such as Teff rust (*Uromyces eragrostidis*), Wheat yellow rust (*Puccinia striiformis*), and Maize Fall Armyworm (*Spodoptera frugiperda*).
- **Severe Connectivity Deficits**: Deep rural farm plots have zero or highly unstable cellular data coverage.
- **Agricultural Extension Shortages**: The ratio of certified agronomists to farming households often exceeds 1:1,000.
- **Linguistic & Literacy Barriers**: Rural farmers communicate across diverse languages and require clear, icon-driven, low-literacy interfaces with high contrast under direct sunlight.

**Root** is engineered to eliminate these obstacles. It does not act as a generic AI chatbot; instead, it deploys a specialized multi-agent expert deliberation council that respects Ethiopian agro-ecological realities, preserves farmer data locally, and guarantees uninterrupted diagnostic advice anytime, anywhere.

---

## 🤖 Multi-Agent Council Architecture

Root coordinates five specialized agronomy agents that analyze crop symptoms through distinct perspectives before producing a consolidated **Advice Card**:

```
                       ┌────────────────────────────┐
                       │   Farmer Query / Symptoms  │
                       │   (Text, Crop, Photo, Zone)│
                       └──────────────┬─────────────┘
                                      │
                                      ▼
                       ┌────────────────────────────┐
                       │  1. ORCHESTRATOR AGENT     │
                       │  • Task dispatch           │
                       │  • Deliberation timeline   │
                       └──────────────┬─────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ 2. DIAGNOSTIC AGENT   │ │ 3. LOCAL CONTEXT AGENT│ │ 4. COMMUNITY AGENT    │
│ • Pathology analysis  │ │ • Agro-zone adaptation│ │ • pgvector memory     │
│ • Urgency & confidence│ │   (Dega/Kolla/etc.)   │ │ • Peer-verified cures │
│ • Primary causes      │ │ • Seasonal alignment  │ │ • Crowd feedback loop │
└───────────┬───────────┘ └───────────┬───────────┘ └───────────┬───────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                       ┌────────────────────────────┐
                       │  5. ADVISOR AGENT          │
                       │  • Synthesizes findings    │
                       │  • Organic bio-remedies    │
                       │  • Chemical thresholds     │
                       │  • Low-literacy summary    │
                       └──────────────┬─────────────┘
                                      │
                                      ▼
                       ┌────────────────────────────┐
                       │    STRUCTURED ADVICE CARD  │
                       │  (Stored in Supabase & IDB)│
                       └────────────────────────────┘
```

### Agent Responsibilities

| Agent | Core Function | Domain Knowledge Applied |
| :--- | :--- | :--- |
| **1. Orchestrator** | Task dispatch & timeline coordination | Real-time SSE streaming, stage duration tracking, pipeline fallback handling. |
| **2. Diagnostic** | Plant symptom pathology & triage | Leaf discoloration, fungal lesions, insect damage, pest staging, severity indexing. |
| **3. Local Context** | Agro-ecological zone adaptation | Ethiopian agro-ecological zones (*Dega, Weyna Dega, Kolla, Bereha*), altitude, soil types, and seasonal weather patterns (*Belg, Meher, Bega*). |
| **4. Community** | Collective farmer wisdom | Queries vector embeddings (`pgvector`) for peer-verified remedies with proven efficacy rates. |
| **5. Advisor** | Low-literacy action synthesis | High-contrast visual Advice Card, immediate field hygiene, non-toxic organic preparations, threshold-based chemical interventions. |

---

## ⚡ 100% Offline-First Architecture

Root is architected from the ground up to provide seamless functionality in remote fields with **zero connectivity**:

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           CLIENT DEVICE                                │
  │                                                                        │
  │  ┌─────────────────────────┐            ┌───────────────────────────┐  │
  │  │   Service Worker (sw)   │            │   IndexedDB Database      │  │
  │  │   • Cache-first assets  │            │   • Offline Advice Cards  │  │
  │  │   • Network-first HTML  │            │   • Mutation Sync Queue   │  │
  │  │   • Background Sync API │            │   • User Profile & Auth   │  │
  │  └───────────┬─────────────┘            └─────────────┬─────────────┘  │
  │              │                                        │                │
  │              ▼                                        ▼                │
  │  ┌─────────────────────────┐            ┌───────────────────────────┐  │
  │  │  Client Agro-Expert     │            │  Background Sync Manager  │  │
  │  │  Heuristic Engine       │            │  • Automatic retry loop   │  │
  │  │  (Instant Offline Card) │            │  • Network restoration    │  │
  │  └─────────────────────────┘            └─────────────┬─────────────┘  │
  └───────────────────────────────────────────────────────┼────────────────┘
                                                          │ Online Reconnect
                                                          ▼
                                            ┌───────────────────────────┐
                                            │     CLOUD (Supabase)      │
                                            │  • PostgreSQL + pgvector  │
                                            │  • Real-time Agent Runs   │
                                            └───────────────────────────┘
```

1. **Service Worker (`public/sw.js`)**:
   - Pre-caches static assets, application shell, icons, and manifest.
   - Intercepts navigation requests with network-first strategy and graceful fallback to `/offline`.
   - Listens for `sync` events via the Background Sync API (`sync-offline-queue`).

2. **Client-Side Agro-Expert Heuristics (`src/lib/offline/offline-expert.ts`)**:
   - When offline, user queries bypass network latency entirely.
   - The on-device expert analyzes symptoms against embedded Ethiopian crop knowledge profiles.
   - Instantly renders a complete, localized Advice Card with immediate field hygiene and bio-remedies.

3. **Background Sync Manager (`src/lib/offline/sync-manager.ts`)**:
   - Queues offline submissions, profile changes, and community votes in IndexedDB (`idb`).
   - Automatically synchronizes queued items to Supabase when network connectivity returns.
   - Features manual "Sync Now" triggers and non-intrusive status indicators.

4. **Offline Authentication & Registration (`src/lib/offline/auth.ts`)**:
   - Allows farmers to register, authenticate, and modify profiles while fully disconnected.
   - Persists encrypted credentials in local storage and queues cloud synchronization seamlessly.

---

## 🌐 Trilingual Localization Engine

Root supports **English**, **Amharic (አማርኛ)**, and **Afaan Oromoo** with strict linguistic purity:

- **Zero-Mixed Output**: Guarantees that advice cards, warnings, and council summaries are presented strictly in the farmer's selected language.
- **Smart Script Detection (`src/lib/i18n/detect-language.ts`)**: Automatically identifies Ethiopic script (Ge'ez Unicode range `\u1200-\u137F`) and Afaan Oromoo agricultural keywords from free-form user input.
- **Automated Parity Verification**: Integrated regression tests enforce 100% key parity across all language dictionaries (`tests/unit/translations-parity.test.ts`).

---

## ✨ Key Features

- **🌾 Multi-Modal Diagnosis**: Input crop type, symptoms, agro-ecological zone, and photo for comprehensive diagnosis.
- **📋 Actionable Advice Cards**: Low-literacy cards featuring urgency badges, visual indicator checklists, step-by-step immediate actions, organic remedies, and seasonal prevention measures.
- **🛰️ Seasonal Agro-Radar**: Contextual calendar showing optimal actions for Ethiopian agricultural seasons (*Belg*, *Meher*, *Bega*).
- **👥 Peer-Verified Community Knowledge**: Upvote/downvote agricultural solutions; successful remedies automatically elevate to future council recommendations.
- **🎨 High-Contrast Radiant UI**: Dark slate & emerald theme with ambient glow effects, optimized for low battery usage and maximum daylight readability.
- **📱 Installable PWA**: One-tap installation on Android, iOS, and desktop browsers with full standalone window support.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15.5](https://nextjs.org/) (App Router) | Modern React 19 architecture with Server Actions and streaming |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict end-to-end type safety |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Radiant emerald dark mode, responsive layouts, accessible UI primitives |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible agro-icons |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + `pgvector`) | Relational storage, RLS security policies, and vector similarity memory |
| **Offline Storage** | [IndexedDB (`idb`)](https://github.com/jakearchibald/idb) | Client-side persistent storage for offline cards and mutation queues |
| **PWA & Caching** | Custom Service Worker | Network-first navigation, asset precaching, background sync |
| **Local AI Engine** | [Ollama](https://ollama.ai/) (`llama3.1:8b`, `qwen2.5:14b`) | Zero-cost, self-hosted LLM inference for multi-agent council |
| **Cloud AI Fallback**| [Google Gemini API](https://ai.google.dev/) (Free Tier) | Optional fallback when Ollama is offline and device is connected |
| **Testing** | Node.js Test Runner + [tsx](https://github.com/privatenumber/tsx) | Fast, native TypeScript unit and regression test suite |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | Automated linting, type-checking, test execution, and build validation |

---

## 📁 Repository Structure

```
Root/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline (lint, typecheck, test, build)
├── public/
│   ├── icons/                   # PWA icons (192x192, 512x512, apple-touch-icon, svg)
│   ├── manifest.json            # Web App Manifest for PWA installation
│   └── sw.js                    # Service worker with offline caching & sync
├── src/
│   ├── app/
│   │   ├── (auth)/              # Login, register, and offline onboarding routes
│   │   ├── (dashboard)/         # Protected farmer dashboard, community, and profile
│   │   ├── api/agents/council/  # Multi-agent council SSE execution endpoint
│   │   ├── diagnose/            # Interactive crop symptom diagnosis & card view
│   │   ├── offline/             # Dedicated offline fallback screen
│   │   ├── globals.css          # Tailwind CSS v4 design tokens and radiant animations
│   │   └── layout.tsx           # Root layout with PWA meta tags and font providers
│   ├── components/
│   │   ├── advice/              # Advice Card viewer, voting buttons, offline list
│   │   ├── agents/              # Deliberation timeline and agent run inspector
│   │   ├── dashboard/           # Agro-radar, seasonal metrics, diagnosis history
│   │   ├── pwa/                 # PWA installation banner and service worker register
│   │   ├── shared/              # Navbar, language switcher, offline sync indicator
│   │   └── ui/                  # Accessible UI primitives (Button, Card, Input, Badge)
│   ├── lib/
│   │   ├── agents/              # 5-Agent Council implementations (Diagnostic, Context, etc.)
│   │   ├── agronomy/            # Ethiopian crop profiles, agro-zones, and seasonal calendars
│   │   ├── i18n/                # Trilingual translations, language detector, context provider
│   │   ├── offline/             # IndexedDB engine, offline expert, sync manager, offline auth
│   │   ├── supabase/            # Supabase client, server actions, and middleware
│   │   └── types/               # TypeScript domain interfaces and database schemas
│   └── middleware.ts            # Route protection, session renewal, and language sync
├── supabase/
│   └── migrations/              # PostgreSQL schema, RLS policies, and pgvector extension
├── tests/
│   ├── regression/              # Deployment readiness, navigation gating, auth tests
│   └── unit/                    # Agronomy knowledge, language detection, offline expert tests
├── .env.example                 # Environment configuration template
├── CONTRIBUTING.md              # Contribution standards and development guidelines
├── LICENSE                      # MIT Open Source License
├── package.json                 # Project dependencies, scripts, and metadata
└── tsconfig.json                # TypeScript compiler configuration (strict mode)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later recommended
- **Ollama** (optional for local multi-agent inference): [Download Ollama](https://ollama.ai/)
- **Supabase Account** (free tier): [Sign up for Supabase](https://supabase.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Amanbey/Root.git
cd Root
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the required configuration keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Ollama Local AI Engine
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Optional Online Fallback (Zero-Cost Gemini Free Tier)
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Initialize Database Schema

In your Supabase project dashboard, navigate to the **SQL Editor** and run the initial migration script:

```bash
supabase/migrations/20261023_001_initial_schema.sql
```

This establishes:
- `profiles`, `questions`, `advice_cards`, `agent_runs`, `timeline_steps`, and `community_remedies` tables.
- Row-Level Security (RLS) policies ensuring farmers only access their respective records.
- Full-text and vector search indices.

### 4. Pull Local AI Model (Ollama)

Ensure the Ollama daemon is running, then pull the recommended model:

```bash
ollama run llama3.1:8b
# Or lightweight alternative:
ollama run qwen2.5:14b
```

### 5. Launch the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

Root maintains a comprehensive automated testing suite covering unit logic, language parity, and deployment readiness:

```bash
# Execute full test suite (23 unit & regression tests)
npm test

# Verify TypeScript types strictly
npm run typecheck

# Run ESLint validation
npm run lint

# Validate production build compilation
npm run build
```

### Test Suite Breakdown

| Test File | Verification Scope |
| :--- | :--- |
| `tests/unit/offline-expert.test.ts` | On-device heuristic engine, localized Amharic/Oromo generation, Advice Card schema integrity. |
| `tests/unit/translations-parity.test.ts` | 100% key parity between English, Amharic, and Afaan Oromoo language dictionaries. |
| `tests/unit/detect-language.test.ts` | Ethiopic script identification, Afaan Oromoo keyword recognition, fallback hierarchy. |
| `tests/unit/agronomy-knowledge.test.ts` | Ethiopian crop profiles, multi-lingual aliases, diagnostic accuracy. |
| `tests/unit/seasonal-calendar.test.ts` | Ethiopian agricultural seasons (*Belg, Meher, Bega*), agro-ecological zones (*Dega, Kolla, etc.*). |
| `tests/regression/deployment-readiness.test.ts` | PWA manifest, service worker presence, `.env.example` completeness, SQL schema validation. |
| `tests/regression/navigation-auth-rules.test.ts` | Navbar gating, sign-out redirection, layer z-indexing, CSS overflow preservation. |

---

## 🚢 Deployment

Root is production-ready for deployment on [Vercel](https://vercel.com) or any standard Node.js hosting platform:

### Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Add the environment variables from `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.).
4. Click **Deploy**.

### PWA Lighthouse Audit Verification

- **Offline Support**: Fully passes PWA offline installation criteria.
- **Performance**: Optimized bundle sizes (<105 kB first load JS shared).
- **Accessibility**: High-contrast ratios meeting WCAG AA guidelines for outdoor visibility.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on code standards, conventional commit formats, and the pull request process.

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feat/amazing-feature`).
3. Commit your Changes (`git commit -m "feat(diagnose): add crop health audio guidance"`).
4. Push to the Branch (`git push origin feat/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">

Crafted with ❤️ for the resilient smallholder farmers of Ethiopia 🇪🇹

</div>
