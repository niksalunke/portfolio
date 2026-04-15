# Fawaz V - Personal Portfolio

A premium, interactive personal portfolio website built with modern web technologies to showcase my projects, technical skills, and professional journey.

## 🚀 Features

- **Immersive Design:** Dark-themed, high-contrast aesthetic with ambient lighting and glassmorphism effects.
- **Scrolly-telling Experience:** Smooth scroll animations and transition effects guided by user interaction.
- **Interactive Projects Grid:** Bento-style grid layout with video previews and detailed modal views for each project.
- **Dynamic Timeline:** Visual representation of my professional career and educational background.
- **Testimonial Marquee:** Infinite scrolling marquee for client and colleague testimonials.
- **Responsive Layout:** Fully optimized for desktops, tablets, and mobile devices.
- **Contact Integration:** Functional contact form integrated with Nodemailer for direct email communication.

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **3D Elements:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Icons:** Custom SVG & Lucide React
- **Video:** [FFmpeg](https://ffmpeg.org/) (for optimization) & HTML5 Video

## 📂 Project Structure

```
├── src/
│   ├── app/             # Application routes (Next.js App Router)
│   ├── components/      # Reusable UI components (Hero, Projects, Skills, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and shared logic
│   └── styles/          # Global styles and Tailwind configuration
├── public/              # Static assets (images, videos, fonts)
├── .env.local           # Environment variables (not committed)
└── package.json         # Project dependencies and scripts
```

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fawazv/personal_porfolio.git
   cd personal_porfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary variables for email services (if applicable):
   ```env
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_app_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm start`: Runs the built production application.
- `npm run lint`: Runs ESLint for code quality checks.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/fawazv/personal_porfolio/issues).

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
