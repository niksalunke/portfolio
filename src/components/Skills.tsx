"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

type DomainNode = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  size: number;
  skills: string[];
  isPrimary?: boolean;
};

type MicroWord = {
  label: string;
  color: string;
  x: number;
  y: number;
  size: number;
  tilt: number;
};

type StageSize = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Constants for word cloud layout
const CLOUD_LAYOUT = {
  BASE_CLOUD_WIDTH: 840, // Reference width for scaling calculations
  MIN_SCALE: 0.72, // Minimum font scale
  MAX_SCALE: 1.06, // Maximum font scale
  SPIRAL_ANGLE_INCREMENT: 0.34, // Radians per step in spiral
  SPIRAL_RADIUS_INCREMENT: 0.36, // Pixels per step in spiral
  SEED_ANGLE_OFFSET: 0.11, // Angle variation from hash
  DRIFT_FACTOR: 0.22, // Random position variation
  MAX_PLACEMENT_ATTEMPTS: 3200, // Max attempts to place a word
  EDGE_PADDING: 10, // Minimum distance from edges
  WORD_PAD: 2, // Padding around word rectangles
  DOMAIN_PAD: 6, // Padding around domain rectangles
} as const;

// Constants for animation
const ANIMATION = {
  STAGGER_DELAY_BASE: 0.045, // Base delay for staggered animations
  STAGGER_DELAY_MAX: 6, // Max hash divisor for delay
  OPACITY_DIMMED: 0.26, // Opacity for non-selected domains
  OPACITY_MICRO_DIMMED: 0.16, // Opacity for micro words when dimmed
  OPACITY_MICRO_NORMAL: 0.55, // Normal opacity for micro words
} as const;

// Constants for responsive breakpoints
const BREAKPOINTS = {
  DESKTOP: 820, // Min width for desktop features
  MOBILE: 640, // Max width for mobile layout
} as const;

const DOMAIN_NODES: DomainNode[] = [
  {
    id: "rag",
    label: "RAG",
    color: "#cf73df",
    x: 50,
    y: 50,
    size: 72,
    isPrimary: true,
    skills: [
      "Hybrid Retrieval",
      "Vector Databases",
      "BM25 + Dense Fusion",
      "Chunking Strategies",
      "Context Compression",
      "Semantic Caching",
      "Reranking Pipelines",
      "Metadata Filtering",
      "Similarity Metrics",
      "Retrieval Evaluation",
      "Latency Optimization",
      "Production Grounding",
    ],
  },
  {
    id: "agents",
    label: "Agents",
    color: "#7ebf54",
    x: 33,
    y: 35,
    size: 36,
    isPrimary: true,
    skills: [
      "Tool Calling",
      "Function Routing",
      "Planner-Executor Loops",
      "Multi-Agent Orchestration",
      "MCP Integrations",
      "Task Memory",
      "Agentic UX Design",
      "Workflow Guards",
      "Reflection Loops",
      "Action Traceability",
    ],
  },
  {
    id: "transformers",
    label: "Transformers",
    color: "#c4b248",
    x: 68,
    y: 35,
    size: 34,
    isPrimary: true,
    skills: [
      "Attention Mechanics",
      "Positional Encoding",
      "KV Cache Optimization",
      "Decoding Strategies",
      "Tokenizer Design",
      "Context Window Tradeoffs",
      "Layer-wise Analysis",
      "Inference Acceleration",
      "Serving Patterns",
      "Model Selection",
    ],
  },
  {
    id: "llmops",
    label: "LLMOps",
    color: "#6ea6dd",
    x: 31,
    y: 60,
    size: 28,
    isPrimary: true,
    skills: [
      "Prompt Versioning",
      "Evaluation Pipelines",
      "Cost Monitoring",
      "Latency Budgets",
      "Tracing + Observability",
      "Experiment Tracking",
      "Model Routing",
      "Rollout Strategy",
      "Failure Recovery",
      "Ops Dashboards",
    ],
  },
  {
    id: "evaluation",
    label: "Evaluation",
    color: "#95a9d6",
    x: 68,
    y: 60,
    size: 27,
    isPrimary: true,
    skills: [
      "Golden Sets",
      "Pairwise Comparisons",
      "Task-Level Metrics",
      "Hallucination Scoring",
      "Human-in-the-Loop Review",
      "Regression Gates",
      "A/B Prompt Tests",
      "Drift Monitoring",
      "Rubric Design",
      "Error Taxonomy",
    ],
  },
  {
    id: "prompting",
    label: "Prompting",
    color: "#ed9f53",
    x: 50,
    y: 69,
    size: 24,
    isPrimary: true,
    skills: [
      "System Prompt Design",
      "Few-shot Structuring",
      "Reasoning Constraints",
      "Output Contracts",
      "Prompt Chaining",
      "Role Conditioning",
      "Guarded Prompts",
      "Context Templates",
      "Fallback Prompts",
      "Prompt Compression",
    ],
  },
  {
    id: "multimodal",
    label: "Multimodal",
    color: "#46b9aa",
    x: 17,
    y: 66,
    size: 20,
    isPrimary: false,
    skills: [
      "Vision-Language Workflows",
      "OCR + VLM Fusion",
      "Image Prompting",
      "Document AI",
      "Audio Transcription Pipelines",
      "Structured Extraction",
      "Cross-modal Retrieval",
      "UI for Multimodal Inputs",
    ],
  },
  {
    id: "guardrails",
    label: "Guardrails",
    color: "#67a46e",
    x: 16,
    y: 30,
    size: 19,
    isPrimary: false,
    skills: [
      "Policy Enforcement",
      "PII Redaction",
      "Toxicity Controls",
      "Output Validation",
      "Schema Enforcement",
      "Prompt Injection Defense",
      "Safety Filters",
      "Escalation Triggers",
    ],
  },
  {
    id: "vectorsearch",
    label: "Vector Search",
    color: "#5f95c7",
    x: 20,
    y: 49,
    size: 22,
    isPrimary: false,
    skills: [
      "FAISS / HNSW",
      "ANN Tuning",
      "Embedding Strategies",
      "Vector Indexing",
      "Cosine / Dot Product",
      "Query Expansion",
      "Cross-Encoder Rerank",
      "Semantic Recall",
      "Retriever Latency",
    ],
  },
  {
    id: "finetuning",
    label: "Fine-tuning",
    color: "#9f7fce",
    x: 57,
    y: 23,
    size: 20,
    isPrimary: false,
    skills: [
      "LoRA / QLoRA",
      "SFT Data Curation",
      "Instruction Tuning",
      "Evaluation Loops",
      "Hyperparameter Search",
      "PEFT Pipelines",
      "Checkpoint Selection",
      "Quality Monitoring",
    ],
  },
  {
    id: "deployment",
    label: "Deployment",
    color: "#d08b47",
    x: 84,
    y: 67,
    size: 16,
    isPrimary: false,
    skills: [
      "Containerized Inference",
      "Autoscaling Endpoints",
      "GPU Utilization",
      "Streaming Responses",
      "Edge Caching",
      "Blue/Green Rollouts",
      "Queue-backed Serving",
      "SLA Monitoring",
    ],
  },
  {
    id: "mcp",
    label: "MCP",
    color: "#6f9ecf",
    x: 79,
    y: 48,
    size: 18,
    isPrimary: false,
    skills: [
      "Tool Schema Design",
      "Server Connectors",
      "Context Injection",
      "Capability Routing",
      "Permission Boundaries",
      "Stateful Tool Flows",
      "Local + Remote Bridges",
      "Developer Ergonomics",
    ],
  },
  {
    id: "reasoning",
    label: "Reasoning",
    color: "#61ad9a",
    x: 44,
    y: 23,
    size: 18,
    isPrimary: false,
    skills: [
      "Chain-of-Thought Handling",
      "Tree-of-Thought Patterns",
      "Deliberate Decoding",
      "Constraint Solving",
      "Plan-then-Execute",
      "Verification Passes",
      "Self-check Routines",
      "Reasoning UX",
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    color: "#b28f57",
    x: 86,
    y: 30,
    size: 16,
    isPrimary: false,
    skills: [
      "System Design",
      "API Contracts",
      "Event-driven Pipelines",
      "Scalable Backends",
      "Data Layering",
      "Design for Reliability",
      "Service Observability",
      "Complexity Management",
    ],
  },
];

const MICRO_TERMS = [
  "embeddings",
  "retrieval",
  "reranking",
  "hallucination",
  "guardrails",
  "latency",
  "throughput",
  "observability",
  "evaluation",
  "benchmarking",
  "prompting",
  "tokenizer",
  "context-window",
  "chunking",
  "metadata",
  "filters",
  "hybrid-search",
  "sparse",
  "dense",
  "vector",
  "index",
  "faiss",
  "hnsw",
  "qdrant",
  "pinecone",
  "pgvector",
  "milvus",
  "ann",
  "cosine",
  "dot-product",
  "euclidean",
  "semantic-cache",
  "streaming",
  "tool-call",
  "function-call",
  "planner",
  "executor",
  "reflection",
  "memory",
  "workflow",
  "agentic-ui",
  "mcp",
  "schema",
  "validation",
  "safety",
  "redaction",
  "pii",
  "toxicity",
  "routing",
  "fallbacks",
  "timeouts",
  "retries",
  "queue",
  "autoscale",
  "gpu",
  "quantization",
  "lora",
  "qlora",
  "sft",
  "dpo",
  "distillation",
  "attention",
  "kv-cache",
  "positional",
  "decoding",
  "beam-search",
  "top-p",
  "temperature",
  "speculative",
  "reasoning",
  "chaining",
  "tree-search",
  "verification",
  "judge-model",
  "ab-tests",
  "golden-set",
  "rubric",
  "telemetry",
  "tracing",
  "error-taxonomy",
  "drift",
  "regression",
  "feature-store",
  "data-quality",
  "versioning",
  "rollbacks",
  "canary",
  "blue-green",
  "container",
  "orchestration",
  "kubernetes",
  "docker",
  "rest",
  "websocket",
  "grpc",
  "events",
  "pub-sub",
  "rabbitmq",
  "kafka",
  "redis",
  "postgres",
  "mongodb",
  "fastapi",
  "nextjs",
  "typescript",
  "python",
  "ci-cd",
  "linting",
  "unit-tests",
  "integration",
  "e2e",
  "security",
  "oauth",
  "authz",
  "rate-limit",
  "sla",
  "slo",
  "cost-ops",
  "budgeting",
  "finops",
  "product-thinking",
  "ux-research",
  "system-design",
  "api-design",
  "backend",
  "frontend",
  "full-stack",
  "optimization",
  "debugging",
  "root-cause",
  "experiments",
  "innovation",
  "vision",
  "leadership",
  "mentorship",
  "ownership",
  "reliability",
  "scalability",
  "resilience",
  "traceability",
  "alignment",
  "compliance",
  "privacy",
  "release",
  "deployment",
  "rollout",
  "feedback-loop",
  "ux-copy",
  "explainability",
  "confidence",
  "calibration",
  "intent",
  "classification",
];

const CLOUD_COLORS = [
  "#d56fe8",
  "#67b85f",
  "#f2b34c",
  "#7daee4",
  "#8ad7c7",
  "#b58bd7",
  "#6fb3be",
  "#c4aa61",
  "#96b7e5",
  "#dc8d5f",
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function hash(input: string): number {
  let value = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    value ^= input.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return Math.abs(value);
}

function estimateWordWidth(label: string, fontSize: number): number {
  // Approximate width based on character count and average aspect ratio
  const CHARACTER_ASPECT_RATIO = 0.62;
  return label.length * fontSize * CHARACTER_ASPECT_RATIO;
}

function createRect(cx: number, cy: number, width: number, height: number, pad = 2): Rect {
  return {
    x: cx - width * 0.5 - pad,
    y: cy - height * 0.5 - pad,
    width: width + pad * 2,
    height: height + pad * 2,
  };
}

function overlaps(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

function domainFontSize(base: number, cloudWidth: number): number {
  const scale = clamp(
    cloudWidth / CLOUD_LAYOUT.BASE_CLOUD_WIDTH,
    CLOUD_LAYOUT.MIN_SCALE,
    CLOUD_LAYOUT.MAX_SCALE
  );
  return Math.round(base * scale);
}

function buildReservedRects(cloudWidth: number, cloudHeight: number): Rect[] {
  return DOMAIN_NODES.map((domain) => {
    const size = domainFontSize(domain.size, cloudWidth);
    const cx = (domain.x / 100) * cloudWidth;
    const cy = (domain.y / 100) * cloudHeight;
    const width = estimateWordWidth(domain.label, size);
    const height = size * 1.12;
    return createRect(cx, cy, width, height, CLOUD_LAYOUT.DOMAIN_PAD);
  });
}

function buildDenseCloudWords(
  terms: string[],
  cloudWidth: number,
  cloudHeight: number
): MicroWord[] {
  const MIN_CLOUD_DIMENSION = 220;
  if (cloudWidth < MIN_CLOUD_DIMENSION || cloudHeight < MIN_CLOUD_DIMENSION) {
    return [];
  }

  const placed: MicroWord[] = [];
  const occupied: Rect[] = buildReservedRects(cloudWidth, cloudHeight);
  const centerX = cloudWidth * 0.5;
  const centerY = cloudHeight * 0.54;

  terms.forEach((label, index) => {
    const seed = hash(`${label}-${index}`);
    const color = CLOUD_COLORS[index % CLOUD_COLORS.length];
    const base = 11 + (index % 5);
    const bonus = index % 13 === 0 ? 3 : index % 9 === 0 ? 2 : 0;
    const size = clamp(base + bonus, 11, 22);
    const width = estimateWordWidth(label, size);
    const height = size * 1.08;

    let found: MicroWord | null = null;

    for (let step = 0; step < CLOUD_LAYOUT.MAX_PLACEMENT_ATTEMPTS; step += 1) {
      const angle = step * CLOUD_LAYOUT.SPIRAL_ANGLE_INCREMENT + (seed % 23) * CLOUD_LAYOUT.SEED_ANGLE_OFFSET;
      const radius = 8 + step * CLOUD_LAYOUT.SPIRAL_RADIUS_INCREMENT;
      const driftX = ((seed % 17) - 8) * CLOUD_LAYOUT.DRIFT_FACTOR;
      const driftY = (((seed >> 3) % 13) - 6) * CLOUD_LAYOUT.DRIFT_FACTOR;

      const cx = centerX + Math.cos(angle) * radius + driftX;
      const cy = centerY + Math.sin(angle) * radius * 0.74 + driftY;

      if (
        cx - width * 0.5 < CLOUD_LAYOUT.EDGE_PADDING ||
        cx + width * 0.5 > cloudWidth - CLOUD_LAYOUT.EDGE_PADDING ||
        cy - height * 0.5 < CLOUD_LAYOUT.EDGE_PADDING ||
        cy + height * 0.5 > cloudHeight - CLOUD_LAYOUT.EDGE_PADDING
      ) {
        continue;
      }

      const rect = createRect(cx, cy, width, height, CLOUD_LAYOUT.WORD_PAD);
      const hit = occupied.some((existing) => overlaps(existing, rect));
      if (hit) {
        continue;
      }

      occupied.push(rect);
      found = {
        label,
        color,
        x: cx,
        y: cy,
        size,
        tilt: 0,
      };
      break;
    }

    if (found) {
      placed.push(found);
    }
  });

  return placed;
}

function buildThreadPath(start: Point, target: Point, idx: number): string {
  const BEND_START_RATIO = 0.25;
  const BEND_END_RATIO = 0.74;
  const OFFSET_MULTIPLIER = 3.2;
  const Y_OFFSET_MULTIPLIER_A = 2.2;
  const Y_OFFSET_MULTIPLIER_B = 1.7;
  
  const offset = ((idx % 7) - 3) * OFFSET_MULTIPLIER;
  const bendA = start.x + (target.x - start.x) * BEND_START_RATIO;
  const bendB = start.x + (target.x - start.x) * BEND_END_RATIO;
  const bendAY = start.y + offset * Y_OFFSET_MULTIPLIER_A;
  const bendBY = target.y - offset * Y_OFFSET_MULTIPLIER_B;
  return `M ${start.x} ${start.y} C ${bendA} ${bendAY}, ${bendB} ${bendBY}, ${target.x} ${target.y}`;
}

function skillImportance(skill: string): string {
  const s = skill.toLowerCase();

  if (s.includes("latency")) {
    return "boosts fast responses";
  }
  if (s.includes("evaluation") || s.includes("metrics") || s.includes("scoring")) {
    return "tracks model quality";
  }
  if (s.includes("routing") || s.includes("orchestration")) {
    return "routes tasks smartly";
  }
  if (s.includes("safety") || s.includes("guard") || s.includes("validation")) {
    return "prevents risky outputs";
  }
  if (s.includes("retrieval") || s.includes("vector") || s.includes("similarity")) {
    return "helps accurate retrieval";
  }
  if (s.includes("monitoring") || s.includes("observability") || s.includes("tracing")) {
    return "finds issues quickly";
  }
  if (s.includes("prompt")) {
    return "steers prompts reliably";
  }
  if (s.includes("cache")) {
    return "cuts token spend";
  }
  if (s.includes("deployment") || s.includes("rollout") || s.includes("container")) {
    return "ships stable releases";
  }
  if (s.includes("attention") || s.includes("decoding") || s.includes("tokenizer")) {
    return "improves model control";
  }

  return "drives production reliability";
}

// Debounce hook for resize events
function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export default function Skills() {
  const [activeDomain, setActiveDomain] = useState<DomainNode | null>(null);
  const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });
  const [cloudSize, setCloudSize] = useState<StageSize>({ width: 0, height: 0 });
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [skillTargets, setSkillTargets] = useState<Point[]>([]);
  const [showAllDomains, setShowAllDomains] = useState(false);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [focusedDomain, setFocusedDomain] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const cloudRef = useRef<HTMLDivElement | null>(null);
  const panelBodyRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const primaryDomains = useMemo(() => DOMAIN_NODES.filter((d) => d.isPrimary), []);
  const secondaryDomains = useMemo(() => DOMAIN_NODES.filter((d) => !d.isPrimary), []);
  const visibleDomains = useMemo(
    () => (showAllDomains ? DOMAIN_NODES : primaryDomains),
    [showAllDomains, primaryDomains]
  );

  const cloudWords = useMemo(
    () => buildDenseCloudWords(MICRO_TERMS, cloudSize.width, cloudSize.height),
    [cloudSize.height, cloudSize.width]
  );
  const isDesktop = stageSize.width >= BREAKPOINTS.DESKTOP;
  const isMobile = stageSize.width < BREAKPOINTS.MOBILE;

  // Debounced resize handler
  const debouncedSetStageSize = useDebouncedCallback((size: StageSize) => {
    setStageSize((prev) => {
      if (prev.width === size.width && prev.height === size.height) {
        return prev;
      }
      return size;
    });
  }, 100);

  const debouncedSetCloudSize = useDebouncedCallback((size: StageSize) => {
    setCloudSize((prev) => {
      if (prev.width === size.width && prev.height === size.height) {
        return prev;
      }
      return size;
    });
  }, 100);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const measure = () => {
      const rect = stage.getBoundingClientRect();
      debouncedSetStageSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [debouncedSetStageSize]);

  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) {
      return;
    }

    const measure = () => {
      const rect = cloud.getBoundingClientRect();
      debouncedSetCloudSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(cloud);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [debouncedSetCloudSize]);

  useEffect(() => {
    if (!activeDomain) {
      return;
    }

    const stage = stageRef.current;
    const panelBody = panelBodyRef.current;
    const source = wordRefs.current[activeDomain.id];

    if (!stage || !panelBody || !source) {
      return;
    }

    const updateGeometry = () => {
      const stageRect = stage.getBoundingClientRect();
      const wordRect = source.getBoundingClientRect();
      setStartPoint({
        x: wordRect.right - stageRect.left + 2,
        y: wordRect.top - stageRect.top + wordRect.height * 0.5,
      });

      const nextTargets = activeDomain.skills
        .slice(0, 10)
  .map((skill) => {
          const row = rowRefs.current[skill];
          if (!row) {
            return null;
          }
          const rowRect = row.getBoundingClientRect();
          return {
            x: rowRect.left - stageRect.left + 14,
            y: rowRect.top - stageRect.top + rowRect.height * 0.5,
          };
        })
        .filter((point): point is Point => point !== null);

      setSkillTargets(nextTargets);
    };

    const raf = window.requestAnimationFrame(updateGeometry);
    const timer = window.setTimeout(updateGeometry, 150);
    const observer = new ResizeObserver(updateGeometry);
    observer.observe(stage);
    observer.observe(panelBody);
    observer.observe(source);
    window.addEventListener("resize", updateGeometry);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("resize", updateGeometry);
    };
  }, [activeDomain, stageSize.height, stageSize.width]);

  // Keyboard navigation handler
  const handleDomainKeyDown = useCallback(
    (e: React.KeyboardEvent, domain: DomainNode) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveDomain(domain);
        setSkillTargets([]);
      }
      if (e.key === "Escape") {
        setActiveDomain(null);
      }
    },
    []
  );

  const handleShowAllToggle = useCallback(() => {
    setShowAllDomains((prev) => !prev);
    setActiveDomain(null);
    setSkillTargets([]);
  }, []);

  return (
    <section
      id="skills"
      className="relative z-20 min-h-screen overflow-hidden bg-[#0b0b0d] px-4 py-28 md:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-10">
          <h2 className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            Technical{" "}
            <span className="bg-linear-to-r from-[#8ec5fc] to-[#e0c3fc] bg-clip-text text-transparent">
              Arsenal
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
            Click any domain to reveal the depth of expertise across your execution stack.
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative min-h-[760px] overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br from-[#141418] via-[#101014] to-[#0c0c0f] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] md:min-h-[700px] md:p-8"
        >
          {/* Domain count indicator */}
          <div className="absolute left-4 top-4 z-30 flex items-center gap-3 md:left-8 md:top-8">
            <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-zinc-400">
              {visibleDomains.length} domains
            </span>
            <button
              type="button"
              onClick={handleShowAllToggle}
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-expanded={showAllDomains}
              aria-label={showAllDomains ? "Show fewer domains" : "Show all domains"}
            >
              {showAllDomains ? "Show Less" : "Show All"}
            </button>
          </div>

          <div
            className={`relative z-20 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activeDomain
                ? "mx-auto w-full lg:mr-auto lg:ml-0 lg:w-[52%] lg:-translate-x-2"
                : "mx-auto w-full lg:w-[78%]"
            }`}
          >
            <div
              ref={cloudRef}
              className="relative h-[660px] overflow-hidden md:h-[620px]"
              role="region"
              aria-label="Interactive skills word cloud. Use Tab to navigate domains, Enter to select."
            >
              {/* Micro terms background */}
              {cloudWords.map((word) => {
                const isDim = Boolean(activeDomain);
                return (
                  <span
                    key={word.label}
                    className="pointer-events-none absolute z-10 select-none font-medium transition-opacity duration-300"
                    style={{
                      left: word.x,
                      top: word.y,
                      transform: `translate(-50%, -50%) rotate(${word.tilt}deg)`,
                      fontSize: `${word.size}px`,
                      color: word.color,
                      opacity: isDim ? ANIMATION.OPACITY_MICRO_DIMMED : ANIMATION.OPACITY_MICRO_NORMAL,
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      letterSpacing: "0.01em",
                      textShadow: `0 0 12px ${word.color}40`,
                    }}
                  >
                    {word.label}
                  </span>
                );
              })}

              {/* Domain nodes */}
              {visibleDomains.map((domain) => {
                const selected = activeDomain?.id === domain.id;
                const dimmed = activeDomain && !selected;
                const displaySize = domainFontSize(domain.size, cloudSize.width || 900);
                const isHovered = hoveredDomain === domain.id;
                const isFocused = focusedDomain === domain.id;

                return (
                  <motion.button
                    key={domain.id}
                    ref={(el) => {
                      wordRefs.current[domain.id] = el;
                    }}
                    type="button"
                    onClick={() => {
                      setActiveDomain(domain);
                      setSkillTargets([]);
                    }}
                    onMouseEnter={() => setHoveredDomain(domain.id)}
                    onMouseLeave={() => setHoveredDomain(null)}
                    onFocus={() => setFocusedDomain(domain.id)}
                    onBlur={() => setFocusedDomain(null)}
                    onKeyDown={(e) => handleDomainKeyDown(e, domain)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      opacity: dimmed ? ANIMATION.OPACITY_DIMMED : 1,
                      scale: selected ? 1.08 : 1,
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="absolute z-30 cursor-pointer select-none font-medium leading-none tracking-tight outline-hidden transition-shadow duration-300"
                    style={{
                      left: `${domain.x}%`,
                      top: `${domain.y}%`,
                      transform: "translate(-50%, -50%)",
                      fontSize: `${displaySize}px`,
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      color: domain.color,
                      textShadow: selected
                        ? `0 0 26px ${domain.color}88`
                        : `0 0 12px ${domain.color}33`,
                      boxShadow: isFocused || isHovered
                        ? `0 0 0 2px ${domain.color}50, 0 0 20px ${domain.color}30`
                        : "none",
                      borderRadius: "8px",
                    }}
                    aria-expanded={selected}
                    aria-label={`${domain.label}. ${domain.skills.length} skills available. Press Enter to view.`}
                    tabIndex={0}
                  >
                    <span className="relative">
                      {domain.label}
                      {/* Click affordance indicator */}
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left scale-x-0 transition-transform duration-300"
                        style={{
                          backgroundColor: domain.color,
                          transform: isHovered || isFocused ? "scaleX(1)" : "scaleX(0)",
                        }}
                        aria-hidden="true"
                      />
                    </span>
                    
                    {/* Skill count tooltip */}
                    <AnimatePresence>
                      {(isHovered || isFocused) && !activeDomain && (
                        <motion.span
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2 }}
                          className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-black/80 px-2.5 py-1 text-xs text-zinc-300 backdrop-blur-sm"
                          style={{ fontSize: "11px" }}
                        >
                          {domain.skills.length > 10 ? "10+" : domain.skills.length} skills →
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Active indicator ring */}
                    {selected && (
                      <motion.span
                        layoutId="active-domain-ring"
                        className="pointer-events-none absolute -inset-3 rounded-xl"
                        style={{
                          background: `radial-gradient(circle, ${domain.color}15 0%, transparent 70%)`,
                          boxShadow: `0 0 30px ${domain.color}40`,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* Instruction hint - always visible when no domain selected */}
              {!activeDomain && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.5 }}
                  className="pointer-events-none absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs uppercase tracking-[0.18em] text-zinc-200 md:bottom-8"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                    Click or press Enter on a domain
                  </span>
                </motion.div>
              )}

              {/* Close button when domain is selected */}
              {activeDomain && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setActiveDomain(null)}
                  className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/20 hover:text-white md:bottom-8"
                  aria-label="Close skills panel"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Close
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Skills panel */}
          <AnimatePresence mode="wait">
            {activeDomain ? (
              <motion.div
                key={activeDomain.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative z-20 mt-8 min-h-[350px] rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm lg:absolute lg:top-8 lg:right-8 lg:mt-0 lg:h-[640px] lg:w-[44%] lg:p-7"
                role="dialog"
                aria-modal="true"
                aria-labelledby="skills-panel-title"
              >
                <div className="mb-5 border-b border-white/10 pb-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
                    Selected Domain
                  </p>
                  <h3
                    id="skills-panel-title"
                    className="mt-2 text-4xl font-bold leading-none md:text-5xl"
                    style={{ color: activeDomain.color }}
                  >
                    {activeDomain.label}
                  </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Showing 10 of {activeDomain.skills.length} skills
                </p>
                </div>

                <div
                  ref={panelBodyRef}
                  className="relative h-auto overflow-auto lg:h-[540px]"
                >
                  <ol className="space-y-1.5" role="list">
                    {activeDomain.skills.map((skill, index) => (
                      <motion.li
                        key={skill}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          delay: (hash(skill) % ANIMATION.STAGGER_DELAY_MAX) * ANIMATION.STAGGER_DELAY_BASE,
                          ease: "easeOut",
                        }}
                        className="rounded-xl border border-white/12 bg-black/45 px-2.5 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                        role="listitem"
                      >
                        <div
                          ref={(el) => {
                            rowRefs.current[skill] = el;
                          }}
                          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5"
                        >
                          <span
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold text-zinc-200"
                            aria-hidden="true"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h4
                            title={skill}
                            className="truncate text-[13px] font-semibold leading-5 text-zinc-100 md:text-sm"
                          >
                            {skill}
                          </h4>
                          <p className="whitespace-nowrap text-right text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-300 md:text-[11px]">
                            {skillImportance(skill)}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* SVG connection threads - desktop only */}
          {activeDomain && startPoint && isDesktop && skillTargets.length > 0 && (
            <svg
              className="pointer-events-none absolute inset-0 z-10"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id={`threadGradient-${activeDomain.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor={`${activeDomain.color}EE`} />
                  <stop offset="70%" stopColor={`${activeDomain.color}B8`} />
                  <stop offset="100%" stopColor="#ffffff66" />
                </linearGradient>
              </defs>

              {skillTargets.map((target, idx) => (
                <g key={`thread-${activeDomain.id}-${idx}`}>
                  <path
                    d={buildThreadPath(startPoint, target, idx)}
                    fill="none"
                    stroke={activeDomain.color}
                    strokeWidth={5.2}
                    strokeLinecap="round"
                    opacity={0.2}
                  />
                  <path
                    d={buildThreadPath(startPoint, target, idx)}
                    fill="none"
                    stroke={`url(#threadGradient-${activeDomain.id})`}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    opacity={0.96}
                  />
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
