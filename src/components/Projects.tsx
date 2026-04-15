"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback } from "react";

// Project Data with Media & Layout Configuration
// Scales to 50+ projects with pagination
const projects = [
  {
    id: "elite-hotel",
    title: "Elite Hotel",
    category: "Full Stack • Microservices",
    description: "Scalable hotel management system with 5+ Node.js services.",
    longDescription: "A comprehensive Microservices-based Hotel Management System designed to streamline reservations, billing, and housekeeping. Built with a focus on scalability and service isolation.",
    techStack: ["Node.js", "Docker", "Kubernetes", "Redis", "RabbitMQ", "Next.js"],
    repo: "https://github.com/fawazv/Elite-hotel",
    demo: "#",
    color: "from-blue-600/20 to-cyan-500/20",
    hoverColor: "group-hover:from-blue-600/40 group-hover:to-cyan-500/40",
    mediaType: "image",
    mediaUrl: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    demoUrl: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "nxtcart",
    title: "Nxtcart",
    category: "E-Commerce",
    description: "Modern shopping platform with automated workflows.",
    longDescription: "A modern e-commerce application featuring secure authentication, payment processing with Stripe/PayPal, and a robust admin dashboard for product management.",
    techStack: ["Next.js", "TypeScript", "Stripe", "MongoDB", "Shadcn UI"],
    repo: "https://github.com/fawazv/nxt-cart",
    demo: "#",
    color: "from-purple-600/20 to-pink-500/20",
    hoverColor: "group-hover:from-purple-600/40 group-hover:to-pink-500/40",
    mediaType: "image",
    mediaUrl: "https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    demoUrl: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "dropbox-clone",
    title: "Dropbox Clone",
    category: "Cloud Storage",
    description: "Secure file storage with drag-and-drop & metadata.",
    longDescription: "A functional clone of Dropbox allowing users to upload, organize, and manage files in the cloud. Features real-time updates and secure authentication.",
    techStack: ["React", "Firebase", "Tailwind CSS"],
    repo: "https://github.com/fawazv/dropbox-clone",
    demo: "#",
    color: "from-orange-500/20 to-red-500/20",
    hoverColor: "group-hover:from-orange-500/40 group-hover:to-red-500/40",
    mediaType: "image",
    mediaUrl: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    demoUrl: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "blog-microservices",
    title: "Blog Platform",
    category: "Microservices",
    description: "Event-driven architecture with RabbitMQ.",
    longDescription: "Built User, Post, and Comment services with API Gateway and RabbitMQ communication. Containerized with Docker Compose and automated pipeline via GitHub Actions.",
    techStack: ["Node.js", "RabbitMQ", "Docker"],
    repo: "https://github.com/fawazv/blog-microservice",
    demo: "#",
    color: "from-green-600/20 to-teal-500/20",
    hoverColor: "group-hover:from-green-600/40 group-hover:to-teal-500/40",
    mediaType: "image",
    mediaUrl: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    demoUrl: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "bookstore-app",
    title: "Bookstore",
    category: "MERN Stack",
    description: "Book management with separate Frontend/Backend.",
    longDescription: "Built RESTful APIs with Express.js and MongoDB for complete book management (CRUD). Developed a responsive React frontend integrated with Axios.",
    techStack: ["MongoDB", "Express", "React"],
    repo: "https://github.com/fawazv/bookstoreapp",
    demo: "#",
    color: "from-indigo-600/20 to-purple-500/20",
    hoverColor: "group-hover:from-indigo-600/40 group-hover:to-purple-500/40",
    mediaType: "image",
    mediaUrl: "https://images.pexels.com/photos/207636/pexels-photo-207636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    demoUrl: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "pixabay-gallery",
    title: "Pixabay Gallery",
    category: "API Integration",
    description: "Image search gallery using Pixabay API.",
    longDescription: "Implemented image search and responsive grid gallery using React, Tailwind CSS, and Axios. Integrated Pixabay API for fetching images.",
    techStack: ["React", "Vite", "Tailwind"],
    repo: "https://github.com/fawazv/1.-react-tailwind-pixabay-gallery",
    demo: "#",
    color: "from-pink-600/20 to-rose-500/20",
    hoverColor: "group-hover:from-pink-600/40 group-hover:to-rose-500/40",
    mediaType: "image",
    mediaUrl: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    demoUrl: "https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: "room-upload",
    title: "Room Upload",
    category: "Cloudinary",
    description: "Secure image upload service details.",
    longDescription: "Built secure image upload flow using Express, Multer, and Cloudinary SDK with TypeScript backend. Developed responsive React + Vite frontend.",
    techStack: ["React", "Multer", "Cloudinary"],
    repo: "https://github.com/fawazv/multer-cloudinary",
    demo: "#",
    color: "from-yellow-600/20 to-orange-500/20",
    hoverColor: "group-hover:from-yellow-600/40 group-hover:to-orange-500/40",
    mediaType: "image",
    mediaUrl: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    demoUrl: "https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
];

// Grid configuration
const GRID_CONFIG = {
  // Responsive breakpoints
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE: 1280,
  // Items per page
  ITEMS_PER_PAGE: 6,
  // Uniform card sizes
  CARD_HEIGHT: "280px", // Fixed height for all cards
} as const;

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(GRID_CONFIG.ITEMS_PER_PAGE);
  const [filter, setFilter] = useState<string | null>(null);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category));
    return Array.from(cats);
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!filter) return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter]);

  const selectedProject = projects.find((p) => p.id === selectedId);
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;
  const totalProjects = projects.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + GRID_CONFIG.ITEMS_PER_PAGE, filteredProjects.length));
  }, [filteredProjects.length]);

  const handleShowLess = useCallback(() => {
    setVisibleCount(GRID_CONFIG.ITEMS_PER_PAGE);
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const clearFilter = useCallback(() => {
    setFilter(null);
    setVisibleCount(GRID_CONFIG.ITEMS_PER_PAGE);
  }, []);

  return (
    <section className="relative z-20 bg-[#0a0a0a] min-h-screen py-32 px-4 md:px-12 overflow-hidden" id="projects">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Selected <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            A curated selection of projects demonstrating full-stack capabilities,
            microservices architecture, and modern interface design.
          </p>
          
          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400">
              <span className="text-white font-semibold">{totalProjects}</span> total projects
            </span>
            {filter && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilter}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
              >
                Filter: {filter}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Category filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilter(filter === cat ? null : cat);
                  setVisibleCount(GRID_CONFIG.ITEMS_PER_PAGE);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === cat
                    ? "bg-white text-black"
                    : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Uniform Grid Layout - All cards same size */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layoutId={project.id}
                onClick={() => setSelectedId(project.id)}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md"
                whileHover={{ scale: 1.02, y: -4 }}
                style={{ height: GRID_CONFIG.CARD_HEIGHT }}
              >
                {/* Media Background */}
                <img
                  src={project.mediaUrl}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-linear-to-br ${project.color} ${project.hoverColor} transition-all duration-500 opacity-60 group-hover:opacity-80 mix-blend-overlay`} />

                {/* Darkener */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                {/* Noise */}
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-blue-300 backdrop-blur-md">
                      {project.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:translate-x-1 transition-transform drop-shadow-lg">
                      {project.title}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-md">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      {project.techStack.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] uppercase tracking-wider text-white/80 bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination / Load More */}
        <motion.div layout className="flex flex-col items-center gap-4 mt-12">
          <div className="text-sm text-zinc-500">
            Showing {visibleProjects.length} of {filteredProjects.length} {filter ? "filtered" : ""} projects
          </div>
          
          <div className="flex gap-4">
            {hasMore && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoadMore}
                className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors backdrop-blur-md flex items-center gap-2 group"
              >
                Load More
                <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
            )}
            
            {visibleCount > GRID_CONFIG.ITEMS_PER_PAGE && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowLess}
                className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors backdrop-blur-md flex items-center gap-2 group"
              >
                Show Less
                <svg className="w-4 h-4 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-60"
            />
            <div className="fixed inset-0 flex items-center justify-center z-70 pointer-events-auto p-4 md:p-8">
              <motion.div
                layoutId={selectedId}
                className="bg-[#121212] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-4xl border border-white/10 shadow-2xl relative scrollbar-hide"
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-6 right-6 z-20 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white/70 hover:text-white transition-colors border border-white/10"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex flex-col md:flex-row h-full">
                  {/* Visual Side */}
                  <div className="w-full md:w-2/5 min-h-[250px] md:min-h-[300px] relative overflow-hidden flex flex-col justify-end p-8">
                    <img
                      src={selectedProject.demoUrl || selectedProject.mediaUrl}
                      alt={selectedProject.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-linear-to-b ${selectedProject.color} mix-blend-overlay opacity-80`} />
                    <div className="absolute inset-0 bg-black/20" />

                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative z-10 inline-block px-3 py-1 rounded-full bg-black/40 text-xs font-mono text-white mb-4 w-fit border border-white/10 backdrop-blur-md"
                    >
                      {selectedProject.category}
                    </motion.span>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative z-10 text-4xl font-bold text-white leading-none tracking-tight drop-shadow-xl"
                    >
                      {selectedProject.title}
                    </motion.h3>
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-3/5 p-8 md:p-12 bg-[#121212]">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">About the project</h4>
                      <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                        {selectedProject.longDescription}
                      </p>

                      <div className="mb-10">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Core Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.techStack.map((tech, i) => (
                            <motion.span
                              key={tech}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + i * 0.05 }}
                              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-200 border border-white/5 transition-colors cursor-default"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-white/10">
                        <a
                          href={selectedProject.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-4 rounded-xl bg-white text-black font-bold text-center hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View Code
                        </a>
                        <a
                          href={selectedProject.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-4 rounded-xl bg-white/5 text-white font-bold text-center hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2"
                        >
                          Live Demo
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
