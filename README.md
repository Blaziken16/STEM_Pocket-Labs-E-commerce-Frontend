#  STEM Pocket Labs E-Commerce Frontend
The lightning-fast, responsive user interface and storefront for the STEM Pocket Labs e-commerce platform.

## Table of Contents
>About the Project

>Key Features

>Tech Stack

>Getting Started

>Project Structure

>Backend Repository

>About the Developer

## About the Project
This repository contains the frontend client for the STEM Pocket Labs e-commerce website. Designed to provide a seamless and engaging user experience, this application acts as the digital storefront for the platform. By leveraging Vite as the build tool alongside React, the application guarantees incredibly fast load times, instant hot-module reloading during development, and a highly optimized build for production.

## Key Features
- Lightning-Fast Performance: Powered by Vite, ensuring rapid startup times and optimized asset delivery compared to traditional bundlers.

- Component-Based Architecture: Built with React to ensure code reusability, easy maintenance, and a scalable UI structure.

- Custom Responsive Design: Utilizes pure CSS and HTML5 to craft a responsive, tailored user interface that works beautifully across mobile, tablet, and desktop devices without the bloat of heavy CSS frameworks.

- Seamless API Integration: Designed to communicate smoothly with the secure Ktor backend, handling JWT authentication, dynamic product fetching, and secure checkouts.

## Tech Stack
**Library:** React.js

**Build Tool:** Vite

**Markup/Styling:** HTML5 & Custom CSS3

**Package Manager:** npm (or yarn)

## Getting Started
Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js) or yarn

**Installation & Execution**

Clone the repository:
```bash
git clone https://github.com/Blaziken16/STEM_Pocket-Labs-E-commerce-Frontend.git
```

**Navigate to the project directory:**
```bash
cd STEM_Pocket-Labs-E-commerce-Frontend
```
**Install the required dependencies:**
```bash
npm install
```
**Set up your environment variables (create a `.env` file to link to your backend):**
```bash
VITE_API_BASE_URL=https://stem-pocket-labs-e-commerce-backend.onrender.com
```
**Start the development server:**
```bash
npm run dev
```
**The Vite development server will start instantly and usually responds at:**
 `https://stem-pocket-labs-e-commerce-fronten.vercel.app/`.

## 📂 Project Structure
```text
├── public/             # Static assets (images, icons)
├── src/                # Core application source code
│   ├── assets/         # Project-specific assets (CSS, logos)
│   ├── components/     # Reusable React components (Buttons, Cards, Navbar)
│   ├── pages/          # Full page views (Home, Shop, Checkout)
│   ├── App.jsx         # Root application component
│   └── main.jsx        # React DOM rendering entry point
├── index.html          # Main HTML template
├── package.json        # Project metadata and dependencies
├── vite.config.js      # Vite build configuration
└── README.md           # You are here!
```
## 🔗 Backend Repository
This frontend is designed to work in tandem with the custom Ktor API backend.

**Backend Repo:** [STEM Pocket Labs E-Commerce Backend](https://github.com/Blaziken16/STEM_Pocket-Labs-E-Commerce-Backend-.git)

## About the Developer
Built with pride by Rishabh Upadhyay. As a 2nd-year B.Tech student at VIT-AP, I am highly focused on mastering full-stack architecture. Building both the backend (Kotlin/Ktor) and frontend (React/Vite) of this platform has allowed me to understand the complete data flow of modern web applications, reinforcing my skills as I work towards integrating AI/ML into real-world software.