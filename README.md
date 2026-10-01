<div align="center">

# ⚡ FlowGTD

### A minimalist, distraction-free Getting Things Done (GTD) Progressive Web App

**Capture everything. Organize with clarity. Execute with focus.**

[![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb?style=flat-square)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=flat-square)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Keyboard Shortcuts](#-keyboard-shortcuts) • [Architecture](#-architecture) • [Deploy](#-deploy-to-github-pages) • [Roadmap](#-roadmap)

### 🌐 Live Demo

**[Try FlowGTD →](https://YOUR_USERNAME.github.io/YOUR_REPO/)**

*Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.*

</div>

---

## 📖 About

FlowGTD is a beautifully crafted Progressive Web App that implements the **Getting Things Done** methodology by David Allen. It helps you capture tasks, organize them by context and project, and focus on what matters most — without the noise.

Inspired by the clean aesthetics of **Linear** and **Things 3**, FlowGTD prioritizes speed, clarity, and intentional design. Every interaction is deliberate. Every pixel earns its place.

> *"Your mind is for having ideas, not holding them."* — David Allen

---

## ✨ Features

### 📥 Capture & Organize
- **Inbox Zero** — Rapid thought capture with auto-focus input
- **Next Actions** — Your daily execution view, grouped by context
- **Projects** — Multi-step outcomes with clear next-action identification
- **Waiting For** — Track delegated items with responsible parties
- **Someday / Maybe** — Incubator for ideas without the pressure

### 🎯 Smart Filtering
- **By Context** — `@home`, `@phone`, `@computer`, `@work`, `@errands`
- **By Energy** — Low energy (quick wins) vs. High energy (deep work)
- **By Time** — `5m`, `10m`, `30m` chips for micro-task batching
- **By Due Date** — Overdue, Today, Upcoming

### ⌨️ Power User Features
- **Command Palette** (`Cmd/Ctrl + K`) — Navigate, search, and quick-add instantly
- **Quick Capture** (`N`) — Add tasks without leaving your current view
- **Inline Editing** — Edit any task property directly in the detail panel
- **Keyboard-first** — Designed for speed, accessible via mouse

### 🎨 Design
- **Light & Dark Mode** — System-aware with manual toggle
- **Responsive** — Desktop sidebar + mobile bottom navigation
- **Smooth Transitions** — Every interaction feels polished
- **Minimalist Aesthetic** — Clean typography, subtle borders, intentional whitespace

### 📱 PWA & Offline
- **Installable** — Add to home screen on any device
- **Offline-first** — Service worker caches assets for offline use
- **Local Storage** — All data persists locally, no server required
- **Zero Tracking** — Your data stays on your device

---

## 🖼️ Screenshots

> *Coming soon — or clone the repo to see it in action!*

| Desktop — Light Mode | Desktop — Dark Mode |
|:---:|:---:|
| ![Desktop Light](docs/desktop-light.png) | ![Desktop Dark](docs/desktop-dark.png) |

| Mobile — Task List | Mobile — Detail Panel |
|:---:|:---:|
| ![Mobile List](docs/mobile-list.png) | ![Mobile Detail](docs/mobile-detail.png) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flowgtd.git
cd flowgtd

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Type-check
npm run typecheck

# Build
npm run build

# Preview production build
npx serve dist
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| `Cmd/Ctrl + K` | Open command palette |
| `N` | Quick capture new task |
| `Escape` | Close panel / deselect |
| `Enter` | Confirm quick capture |

---

## 🏗️ Architecture

```
flowgtd/
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker (offline support)
│   ├── favicon.svg         # App icon
│   └── icon-*.png          # PWA icons
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx         # Desktop navigation
│   │   ├── MobileNav.tsx       # Mobile bottom navigation
│   │   ├── TaskList.tsx        # Main list view with filters
│   │   ├── TaskItem.tsx        # Individual task row
│   │   ├── TaskDetail.tsx      # Slide-out edit panel
│   │   ├── ProjectsView.tsx    # Projects list + detail
│   │   ├── ContextsView.tsx    # Context-based filtering
│   │   └── CommandPalette.tsx  # Cmd+K search & navigation
│   ├── types.ts            # TypeScript interfaces
│   ├── store.ts            # State management & localStorage
│   ├── seed.ts             # Realistic demo data
│   ├── App.tsx             # Root component & routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind + custom styles
├── index.html              # PWA meta tags
├── vite.config.js          # Vite configuration
├── tsconfig.json           # TypeScript config
└── package.json            # Dependencies
```

### Data Model

Every task follows a strict schema:

```typescript
interface Task {
  id: string;              // UUID
  title: string;           // Required
  notes: string;           // Optional markdown/text
  status: 'inbox' | 'next_action' | 'waiting_for' | 'someday_maybe' | 'completed';
  projectId: string | null;
  context: '@home' | '@phone' | '@computer' | '@work' | '@errands' | null;
  timeEstimate: '5m' | '10m' | '30m' | null;
  energyLevel: 'low' | 'high' | null;
  dueDate: string | null;  // ISO date string
  delegatedTo: string | null;
  createdAt: string;       // ISO timestamp
  completedAt: string | null;
  order: number;
}
```

### State Management

FlowGTD uses a **simple, transparent state model**:
- React `useState` for UI state
- `localStorage` for persistence
- No external state libraries — everything is predictable and debuggable

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Framework** | React 18 + TypeScript 5.7 |
| **Styling** | Tailwind CSS 4.1 |
| **Build Tool** | Vite 6 |
| **Icons** | Lucide React |
| **Dates** | date-fns |
| **UUIDs** | uuid |
| **PWA** | Service Worker + Web Manifest |

---

## 📋 GTD Workflow

FlowGTD supports the complete GTD workflow:

1. **Capture** → Everything goes into the Inbox
2. **Clarify** → Process each item: Is it actionable?
   - No → Trash, Someday/Maybe, or Reference
   - Yes → What's the next action?
3. **Organize** → Assign context, project, energy, time
4. **Reflect** → Weekly review using context/project views
5. **Engage** → Execute based on context, time available, and energy

---

## 🔮 Roadmap

- [ ] Drag-and-drop task reordering
- [ ] Recurring tasks
- [ ] Tags / custom labels
- [ ] Weekly review checklist
- [ ] Import/export (JSON, CSV)
- [ ] Cloud sync (optional)
- [ ] Natural language date parsing ("tomorrow", "next Friday")
- [ ] Task templates
- [ ] Statistics & analytics dashboard

---

## 🚀 Deploy to GitHub Pages

FlowGTD includes a ready-to-use GitHub Actions workflow for automatic deployment to GitHub Pages. Every push to `main` triggers a build and deploy.

### One-Time Setup

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages** in your repository:
   - Go to **Settings → Pages**
   - Under **Source**, select **GitHub Actions**
   - Save

3. **That's it!** The workflow will automatically:
   - Build the project with the correct base path
   - Deploy to `https://YOUR_USERNAME.github.io/YOUR_REPO/`
   
   > 💡 **Find your live URL**: Go to **Settings → Pages** — your deployed URL will be displayed at the top of the page.

### Manual Deployment

You can also trigger a deploy manually:
- Go to the **Actions** tab
- Select **Deploy to GitHub Pages**
- Click **Run workflow**

### How It Works

```
.github/workflows/deploy.yml
```

The workflow uses:
- `GITHUB_PAGES_BASE` env var → sets Vite's `base` path to `/<repo-name>/`
- `actions/upload-pages-artifact@v3` → packages the `dist/` folder
- `actions/deploy-pages@v4` → publishes to GitHub Pages

### Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file in `public/` with your domain (e.g., `flowgtd.app`)
2. Configure DNS per [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **David Allen** — For the GTD methodology
- **Linear** & **Things 3** — For design inspiration
- **Lucide** — For beautiful, consistent icons
- The open-source community

---

<div align="center">

**Made with ❤️ for focused productivity**

[⭐ Star this repo](#) if you find it useful!

</div>
