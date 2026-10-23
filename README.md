# Root – Offline-First Multi-Agent Agricultural Advisory Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Base%20Nova-black?style=flat-square)](https://ui.shadcn.com/)
[![Ollama](https://img.shields.io/badge/AI%20Engine-Ollama%20(Local)-orange?style=flat-square)](https://ollama.ai/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline%20First-success?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

**Root** is a production-grade Progressive Web App (PWA) built specifically for smallholder farmers in Ethiopia. It provides instant, practical crop problem diagnosis, low-cost organic remedy advice, and peer-to-peer knowledge sharing — **even when working completely disconnected in rural fields with zero internet**.

---

## 🌾 Core Product Vision

Root is **not** a generic conversational chatbot. It is a **multi-agent agronomy engine** where specialized AI agents collaborate across distinct agronomic domains:

1. **Orchestrator Agent**: Manages agent task dispatch and live step-by-step progress timelines.
2. **Diagnostic Agent**: Analyzes crop symptoms, leaf blight patterns, discoloration, and pest manifestations.
3. **Local Context Agent**: Adapts solutions to Ethiopian agro-ecological zones (*Dega, Weyna Dega, Kolla, Bereha*), local soil types, and seasonal weather patterns (*Belg vs. Meher*).
4. **Community Knowledge Agent**: Matches current crop dilemmas against peer-verified farmer solutions stored in Supabase vector memory (`pgvector`).
5. **Advisor Agent**: Synthesizes the council's findings into a high-contrast, structured **Advice Card** featuring actionable steps, organic treatments, urgency levels, and low-cost preventive measures.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui + Lucide Icons
- **Offline / PWA**: Service Worker caching, Web App Manifest, IndexedDB queue (`idb`)
- **Primary AI Engine**: Ollama (local models: `llama3.1:8b` or `qwen2.5:14b`)
- **Online Fallback AI**: Free Gemini API tier (zero paid requirements)
- **Database & Auth**: Supabase (PostgreSQL, `pgvector`, Supabase Auth, Storage)
- **State Management**: Zustand
- **Form Validation**: React Hook Form + Zod

---

## 📱 Mobile-First & Low-Literacy Principles

Smallholder farmers often operate in bright sunlight on affordable Android devices with low connectivity and variable literacy. Root addresses these realities directly:

- **Visual Clarity**: High-contrast dark and emerald themes with bold agro-icons.
- **Multilingual Ready**: Architecture supporting English, Amharic (አማርኛ), and Afaan Oromoo.
- **Persistent Local Cache**: Advice cards, crop profiles, and diagnosis history remain available on the phone without internet.
- **Auto-Sync Queue**: Queries submitted offline queue securely in IndexedDB and automatically synchronize when internet is detected.

---

## 📋 Implementation Roadmap

- [x] **Phase 1: Project Foundation** (Next.js 15, shadcn/ui, PWA service worker, manifest, environment setup, domain types)
- [ ] **Phase 2: Supabase Setup & Authentication** (Auth flows, login, registration, farmer profile)
- [ ] **Phase 3: Database Schema & Types** (Postgres schema, pgvector extension, RLS security policies)
- [ ] **Phase 4: Question Submission & Single-Agent Flow** (Text/photo submission, Ollama local integration, advice cards)
- [ ] **Phase 5: Multi-Agent System** (5-agent council orchestration, live progress timeline, agent run history)
- [ ] **Phase 6: Community Knowledge & Feedback** (Helpful/unhelpful voting loop, semantic vector search)
- [ ] **Phase 7: Offline-First Architecture** (IndexedDB background sync, service worker sync handlers)
- [ ] **Phase 8: Dashboard, Polish & Finalization** (Farmer dashboard, multilingual structure, final QA)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- [Ollama](https://ollama.ai/) installed locally (for local AI inference)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/root.git
cd Root
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your local or Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

### 3. Pull the Recommended Local AI Model

Ensure your local Ollama daemon is running, then pull Llama 3.1 8B:

```bash
ollama run llama3.1:8b
```

*(Alternatively: `ollama run qwen2.5:14b`)*

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🧪 Testing Phase 1 Foundation

1. **Verify Development Server**:
   ```bash
   npm run build
   ```
   Ensure Next.js compiles without any TypeScript or Tailwind errors.

2. **Verify PWA Assets**:
   - Navigate to `/manifest.json` in your browser to verify the Web App Manifest.
   - Navigate to `/offline` to test the dedicated bilingual offline fallback screen.
   - Inspect Chrome DevTools -> Application -> Service Workers to confirm registration of `/sw.js`.

3. **Verify UI & Components**:
   - Inspect the responsive homepage layout on mobile viewports (360px - 412px).
   - Test the high-contrast badges, agent council cards, and navigation.

---

## 📄 License

MIT © Root Agricultural Advisory
