# Bible Memory Project

A Bible memory and study web app for building scripture memorization habits, with flash cards, streak tracking, and a dark-first design system.

**Live demo:** https://bible-memory-project-chi.vercel.app

## Features

- **Bible Memory Grid** for structured verse memorization
- **Flash Cards** with deck management
- **Dashboard** with activity heatmaps and streak tracking
- **Guest mode** so visitors can try the app without an account
- **Multi-page routing** across memory, flash card, and dashboard views
- **Toast notifications** for in-app feedback
- **Settings page** with a Danger Zone for account/data management
- **Mobile responsive** layout with an overlay sidebar
- Handles messy verse formatting from the underlying Bible API, including poetic verse structures and apostrophe variants

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** CSS Modules, with a dark-first theme system driven by CSS custom properties (five theme colors)
- **Backend / Auth:** Supabase
- **Routing:** React Router v6
- **Bible text:** Bolls Life Bible API
- **Font:** Inter Tight

## Project Structure

```
src/
├── features/   # Feature-specific logic and components (memory grid, flash cards, etc.)
├── pages/      # Top-level page components
├── context/    # React context providers
└── utils/      # Shared utility functions (extractLetters, chunkVerses, calculateStreak, stripHtml)
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A Supabase project (URL + anon key)

### Installation

```bash
git clone https://github.com/ddelportgit/bible-memory-project.git
cd bible-memory-project
npm install
```

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Deployment

Deployed on Vercel.

## Notes

The `stripHtml` utility is an ongoing effort to clean up formatting inconsistencies in NKJV verse data returned by the Bolls API.
