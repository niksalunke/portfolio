"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  category: "certification" | "award";
  icon: string;
  color: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    id: "1",
    title: "Oracle Cloud Infra GenAI Certified Professional",
    issuer: "Oracle",
    date: "2024",
    credentialId: "",
    category: "certification",
    icon: "cloud",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "2",
    title: "AWS Academy Graduate",
    issuer: "AWS",
    date: "2022",
    category: "certification",
    icon: "aws",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: "3",
    title: "Product Management ",
    issuer: "TurnIP Innovations",
    date: "2022",
    credentialId: "",
    category: "certification",
    icon: "medal",
    color: "from-orange-400 to-red-500",
  },
  {
    id: "4",
    title: "Rockstar performer",
    issuer: "Vodafone Idea Ltd",
    date: "2025",
    category: "award",
    icon: "medal",
    color: "from-purple-400 to-pink-500",
  },
  {
    id: "5",
    title: "Dream Team",
    issuer: "Vodafone Idea Ltd",
    date: "2026",
    credentialId: "",
    category: "award",
    icon: "trophy",
    color: "from-blue-500 to-cyan-500",
  },

];

// Icon components
const Icons: Record<string, React.FC<{ className?: string }>> = {
  aws: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.295.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.863.279l-.287-.48c.32-.152.656-.28 1.005-.384a4.38 4.38 0 0 1 1.053-.144c.735 0 1.262.168 1.595.503.326.335.495.87.495 1.612v.719zm-3.61.695c.335 0 .67-.064.99-.199.32-.136.575-.352.775-.64v-.623h-.023c-.28-.056-.575-.104-.886-.136-.31-.032-.607-.048-.894-.048-.446 0-.79.08-1.037.247-.247.16-.375.399-.375.71 0 .288.096.503.295.646.2.152.503.223.895.223h.26zm6.037-4.026c0 .08-.024.143-.072.199-.048.056-.112.08-.184.08h-2.1v6.217c0 .08-.024.151-.072.207-.048.056-.112.08-.184.08h-1.14c-.072 0-.136-.024-.184-.08a.285.285 0 0 1-.08-.207V6.785h-2.1c-.072 0-.136-.024-.184-.08a.285.285 0 0 1-.08-.199v-.959c0-.08.024-.143.08-.199.048-.056.112-.08.184-.08h5.668c.072 0 .136.024.184.08.048.056.072.12.072.2v.959zm4.04 1.452h1.14c.072 0 .136.024.184.08.048.056.072.12.072.2v5.566c0 .08-.024.151-.072.207-.048.056-.112.08-.184.08h-1.14c-.072 0-.136-.024-.184-.08a.285.285 0 0 1-.08-.207V7.437c0-.08.024-.143.08-.199.048-.056.112-.08.184-.08zm.575-2.155c.208 0 .383.072.526.216.144.143.216.319.216.527 0 .208-.072.384-.216.527-.143.144-.319.216-.526.216-.208 0-.384-.072-.527-.216a.718.718 0 0 1-.216-.527c0-.208.072-.384.216-.527.143-.144.319-.216.527-.216zm3.61 2.155h1.14c.072 0 .136.024.184.08.048.056.072.12.072.2v5.566c0 .08-.024.151-.072.207-.048.056-.112.08-.184.08h-1.14c-.072 0-.136-.024-.184-.08a.285.285 0 0 1-.08-.207V7.437c0-.08.024-.143.08-.199.048-.056.112-.08.184-.08zm.575-2.155c.208 0 .383.072.526.216.144.143.216.319.216.527 0 .208-.072.384-.216.527-.143.144-.319.216-.526.216-.208 0-.384-.072-.527-.216a.718.718 0 0 1-.216-.527c0-.208.072-.384.216-.527.143-.144.319-.216.527-.216z"/>
    </svg>
  ),
  trophy: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.243C8.19 18.7 7.25 19.5 7.25 21"/><path d="M14 14.66V17c0 .55.47.98.97 1.243C15.81 18.7 16.75 19.5 16.75 21"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
  ),
  code: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  medal: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v1.5a1.5 1.5 0 0 0 3 0v-1.5"/>
    </svg>
  ),
  cloud: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3-1.3-3-3s1.3-3 3-3c.5 0 .9.1 1.3.3.4-2.2 2.4-3.9 4.7-3.9 2.3 0 4.3 1.7 4.7 3.9.4-.2.8-.3 1.3-.3 1.7 0 3 1.3 3 3s-1.3 3-3 3z"/>
    </svg>
  ),
  star: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
  link: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  sparkles: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
};

export default function Certifications() {
  const [filter, setFilter] = useState<"all" | "certification" | "award">("all");
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const filteredCerts = filter === "all" 
    ? CERTIFICATIONS 
    : CERTIFICATIONS.filter(c => c.category === filter);

  // Duplicate for seamless marquee
  const displayCerts = [...filteredCerts, ...filteredCerts, ...filteredCerts];

  return (
    <section className="relative z-20 bg-[#0a0a0a] py-32 overflow-hidden" id="certifications">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 mb-12 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Certifications &amp;{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
            Awards
          </span>
        </motion.h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Professional credentials and recognitions that validate my expertise.
        </p>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 flex-wrap"
        >
          {[
            { key: "all", label: "All" },
            { key: "certification", label: "Certifications" },
            { key: "award", label: "Awards" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === key
                  ? "bg-white text-black"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="relative w-full overflow-hidden mask-linear-fade">
        {/* Mask gradient for fade effect on edges */}
        <div className="absolute top-0 left-0 w-32 h-full z-20 bg-linear-to-r from-[#0a0a0a] to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-full z-20 bg-linear-to-l from-[#0a0a0a] to-transparent" />

        <div className="flex w-max">
          <motion.div
            key={filter} // Re-animate on filter change
            className="flex gap-6 px-4"
            animate={{ x: "-50%" }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {displayCerts.map((cert, index) => {
              const Icon = Icons[cert.icon];
              return (
                <motion.div
                  key={`${cert.id}-${index}`}
                  onClick={() => setSelectedCert(cert)}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="w-[320px] md:w-[380px] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shrink-0 cursor-pointer group hover:bg-white/10 transition-colors"
                >
                  {/* Header with icon and badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} p-0.5`}>
                      <div className="w-full h-full rounded-xl bg-[#0a0a0a] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-semibold ${
                      cert.category === "certification"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}>
                      {cert.category}
                    </span>
                  </div>

                  {/* Title and issuer */}
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                    {cert.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {cert.issuer}
                  </p>

                  {/* Footer with year */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-gray-500 text-sm font-mono">{cert.date}</span>
                    <span className="text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      View
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCert && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>

                {/* Icon */}
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${selectedCert.color} p-1 mb-6`}>
                  <div className="w-full h-full rounded-2xl bg-[#1a1a1a] flex items-center justify-center">
                    {(() => {
                      const Icon = Icons[selectedCert.icon];
                      return <Icon className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <span className={`inline-block text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${
                    selectedCert.category === "certification"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  }`}>
                    {selectedCert.category}
                  </span>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedCert.title}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {selectedCert.issuer}
                  </p>

                  <div className="space-y-3 text-left bg-black/30 rounded-xl p-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-sm">Issued</span>
                      <span className="text-white text-sm">{selectedCert.date}</span>
                    </div>
                    {selectedCert.credentialId && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Credential ID</span>
                        <span className="text-white text-sm font-mono">{selectedCert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedCert(null)}
                    className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
