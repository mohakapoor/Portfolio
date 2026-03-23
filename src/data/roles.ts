export interface RoleTokenSet {
  primary: string;
  tertiary: string;
  primaryContainer: string;
  onPrimary: string;
  secondaryContainer: string;
  error: string;
  outlineVariant: string;
}

export interface RoleData {
  id: string;
  label: string;
  counter: string;
  tagline: string;
  tags: string[];
  tokens: RoleTokenSet;
  rotationY: number; // The target angle in radians for the 3D model 
  backgroundImage: string;
}

// 0, 120deg, 240deg in radians
const DEG_TO_RAD = Math.PI / 180;

export const rolesData: RoleData[] = [
  {
    id: "ml",
    label: "ML Engineer",
    counter: "01 / 03",
    tagline: "Architecting high-performance models for anomaly detection and forecasting. From statistical baselines to deep neural deployments.",
    tags: ["Python", "PyTorch", "LightGBM", "cuML", "Time-Series"],
    rotationY: 0,
    tokens: {
      primary: "#cc2936",
      tertiary: "#e84050",
      primaryContainer: "#a01f2a",
      onPrimary: "#ffe8e8",
      secondaryContainer: "#474746",
      error: "#ff3333",
      outlineVariant: "#484847",
    },
    backgroundImage: "/bg_landscape1.png",
  },
  {
    id: "ds",
    label: "Data Scientist",
    counter: "02 / 03",
    tagline: "Transforming raw telemetry into actionable signals. Heavy focus on synthetic data generation, robust feature engineering, and analytics.",
    tags: ["Pandas", "Feature Eng", "EDA", "Statistical Analysis"],
    rotationY: 0,
    tokens: {
      primary: "#ec4899",
      tertiary: "#ff7ab9",
      primaryContainer: "#b8126b",
      onPrimary: "#36001a",
      secondaryContainer: "#474746",
      error: "#ff3333",
      outlineVariant: "#484847",
    },
    backgroundImage: "/bg_landscape2.png",
  },
  {
    id: "ai",
    label: "AI Engineer",
    counter: "03 / 03",
    tagline: "Building end-to-end intelligent systems. From crafting LLM outreach pipelines to integrating real-time computer vision into web apps.",
    tags: ["LLMs", "Generative AI", "Computer Vision", "Next.js"],
    rotationY: 0,
    tokens: {
      primary: "#a1faff",
      tertiary: "#4dedff",
      primaryContainer: "#00a7b5",
      onPrimary: "#003338",
      secondaryContainer: "#474746",
      error: "#ff3333",
      outlineVariant: "#484847",
    },
    backgroundImage: "/bg_landscape3.png",
  }
];
