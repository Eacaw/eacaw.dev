<div align="center">

# 🌐 eacaw.dev

<img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />

**A personal portfolio website with a cyberpunk-inspired dark theme**

[🔗 Live Site](https://eacaw.dev) • [📂 Source Code](https://github.com/Eacaw/eacaw.dev)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 **Modern UI/UX**
- Cyberpunk-inspired dark theme with purple/cyan accents
- Smooth animations and transitions
- Fully responsive design
- Custom scrollbar styling

</td>
<td width="50%">

### 📊 **GitHub Integration**
- Live contribution heatmap
- 14-day activity timeline with filtering
- Multi-account support (personal & work)
- Work activity anonymization

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ **Project Showcase**
- Dynamic project cards with modals
- Markdown content support
- Firebase-powered CMS
- Admin dashboard for content management

</td>
<td width="50%">

### 🔐 **Authentication**
- Firebase Authentication
- Protected admin routes
- Secure content management

</td>
</tr>
</table>

---

## 🚀 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16, React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4, Radix UI |
| **Backend** | Firebase (Auth, Firestore) |
| **Charts** | Recharts |
| **Deployment** | Docker, Node.js |

---

## 📁 Project Structure

```
eacaw.dev/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes (GitHub integration)
│   ├── login/              # Authentication page
│   └── page.tsx            # Main landing page
├── components/
│   ├── github/             # GitHub activity components
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Hero, About, Projects, Contact
│   └── ui/                 # Reusable UI components
├── contexts/               # React Context providers
├── lib/                    # Utilities and Firebase config
└── Dockerfile              # Production Docker image
```

---

## 🏃 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project (for authentication & data)

### Installation

```bash
# Clone the repository
git clone https://github.com/Eacaw/eacaw.dev.git
cd eacaw.dev

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase config and GitHub PATs

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# GitHub Personal Access Tokens
GITHUB_PAT=           # Personal account
GITHUB_PAT_WORK=      # Work account (optional)
```

---

## 🐳 Docker Deployment

```bash
# Build the Docker image
docker build -t eacaw-dev \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=xxx \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx \
  # ... other build args
  .

# Run the container
docker run -p 3000:3000 eacaw-dev
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type check without building |

---

<div align="center">

**Built with 💜 by [Eacaw](https://github.com/Eacaw)**

</div>
