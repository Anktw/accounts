# Accounts Service

🚀 This is the authentication frontend for all my projects, built with Next.js, TypeScript, and Tailwind CSS.
🌐 Backend API: [backend](https://github.com/Anktw/backend)
🐳 For Dockerized backend, visit [backend-docker](https://github.com/Anktw/backenddocker)

![image](https://github.com/user-attachments/assets/8c292a9c-41af-4289-a2b3-e31bb3904a8a)

## Quick Start

1. 📋 Clone repository
   ```powershell
   git clone https://github.com/Anktw/accounts.git
   cd accounts
   ```
2. 📦 Install dependencies
   ```powershell
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. 🔑 Setup environment variables
   - Copy `env.example` to `.env` and fill in the values
   ```powershell
   copy env.example .env
   ```
   - Set `FAST_URL` to your backend API URL (e.g. http://localhost:8000)
4. 🏃 Run the development server
   ```powershell
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features
- ✉️ Email/password authentication
- 📱 Phone number login/signup (OTP)
- 🔗 Social login (Google, GitHub)
- 🛡️ JWT session management (encrypted cookies)
- 🧑 Account dashboard & profile editing
- 🌗 Light/dark mode toggle
- 🧩 Built with Next.js App Router, Tailwind CSS, Radix UI, Lucide icons

## Deployment
You can deploy this app to any platform supporting Node.js.
Recommended: [Vercel](https://vercel.com/) (zero-config for Next.js)

**Environment variables:**
- `FAST_URL` — URL of your backend API (see [backend](https://github.com/Anktw/backend))

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [jwt-decode](https://github.com/auth0/jwt-decode)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [clsx](https://github.com/lukeed/clsx)
- [class-variance-authority](https://cva.style/)

---

## Author
Made with ❤️ by [Unkit](https://unkit.site)
