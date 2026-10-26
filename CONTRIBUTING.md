# Contributing to Root Advisory

Thank you for your interest in contributing to **Root** — an offline-first multi-agent agronomy platform engineered for Ethiopian smallholder farmers. We welcome contributions from developers, agronomists, translators, and open-source enthusiasts.

---

## 🌾 Guiding Principles

1. **Farmer-Centric UX**: Designs must be high-contrast, highly legible under direct sunlight, and optimized for low-end mobile devices and variable literacy levels.
2. **100% Offline-First**: Every core feature (crop diagnosis, advice viewing, query submission, authentication) must function smoothly when disconnected from the internet.
3. **Pure Trilingual Localization**: Translations in English, Amharic (አማርኛ), and Afaan Oromoo must remain natural, culturally authentic, and free of mixed language artifacts.
4. **Zero Paid Tier Constraint**: The application must run entirely using free or self-hosted tools (Next.js, Supabase Free Tier, Ollama local inference, free Gemini API tier).

---

## 🚀 Development Workflow

### 1. Fork & Clone

```bash
git clone https://github.com/your-username/Root.git
cd Root
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your local Supabase credentials and local Ollama endpoint.

### 3. Branching Conventions

Create a descriptive feature branch from `main`:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/issue-description
```

### 4. Code Quality & Standards

Before submitting a Pull Request, ensure that all quality gates pass:

```bash
# 1. Linting
npm run lint

# 2. TypeScript strict type-checking
npm run typecheck

# 3. Comprehensive unit & regression test suite
npm test

# 4. Production build validation
npm run build
```

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new user-facing feature or enhancement
- `fix:` A bug fix or regression remedy
- `test:` Adding or updating tests
- `docs:` Documentation additions or updates
- `refactor:` Code improvements without behavioral changes
- `perf:` Performance optimizations

**Example**:
```bash
git commit -m "feat(offline): add background sync retry mechanism for advice cards"
```

---

## 🌐 Adding & Updating Translations

All application strings are centrally maintained in `src/lib/i18n/translations.ts`. When adding new keys:
- Add the key to English (`en`), Amharic (`am`), and Afaan Oromoo (`om`).
- Run `npm test` to ensure `translations-parity.test.ts` validates 100% key parity across all languages.

---

## 📄 License

By contributing to Root, you agree that your contributions will be licensed under the [MIT License](LICENSE).
