# Feminine Aura Frontend

A modern React + Vite frontend for the Feminine Aura platform, designed to deliver a polished, responsive, and elegant digital experience for wellness and lifestyle customers.

## Live Demo

- https://feminineaurafrontend.vercel.app

## Overview

This frontend application powers the user-facing experience for Feminine Aura. Built with React, Vite, Tailwind CSS, and modern frontend tooling, it is optimized for a fast, mobile-friendly, and visually refined interface.

## Features

- Responsive user interface
- Fast development workflow with Vite
- Tailwind CSS-based styling
- Routing with React Router
- Stripe-ready frontend support
- Reusable component architecture
- Mobile-friendly design system
- Vercel deployment ready

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Stripe.js
- Lucide React

## Project Structure

```bash
feminineaurafrontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
├── vite.config.js
├── README.md
├── package-lock.json
└── .env.example
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/naseemsuleiman/feminineaurafrontend.git
cd feminineaurafrontend
```

2. Install dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Then open the app in your browser at the localhost URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build for Production

Create a production build:

```bash
npm run build
```

Preview it locally:

```bash
npm run preview
```

## Environment Variables

Create a `.env` or `.env.local` file if needed:

```env
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Deployment

This project is configured for deployment on Vercel.

### Deploy to Vercel

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add any environment variables
4. Deploy the app

## Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## Contributing

Contributions are welcome. Please create a branch for your changes, then push and open a pull request.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

## License

This project currently does not include a license file. If you plan to distribute it publicly, consider adding a license that matches your intended usage.

## Support

For questions or issues, open an issue in the GitHub repository.

---

Built for Feminine Aura.
