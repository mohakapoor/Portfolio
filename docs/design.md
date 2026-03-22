# Portfolio Design Document

## 🎯 Overview

This is a **Next.js 14** portfolio website with a **noir/cyberpunk aesthetic** that automatically pulls GitHub repositories and displays them as interactive cards. The design emphasizes **dark themes**, **glass morphism**, and **dynamic content** that stays up-to-date without manual intervention.

## 🏗️ Architecture

### **Tech Stack**
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Fonts**: Local fonts (Newspaper Headline, Roboto Mono)
- **APIs**: GitHub REST API (proxied through Next.js API routes)
- **Deployment**: Static export ready

### **Project Structure**
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page with custom cursor
│   ├── story/page.tsx     # About/story page
│   ├── projects/page.tsx  # Dynamic GitHub projects
│   └── api/               # Backend API routes
│       └── github/
│           ├── repos/route.ts      # Repository data proxy
│           └── readme/[repo]/route.ts  # README content proxy
├── components/            # Reusable React components
│   └── TargetCursor.tsx  # Custom cursor for landing page
└── globals.css           # Global styles and CSS variables
```

## 🎨 Design System

### **Color Palette**
```css
--spider-red: #dc2626        /* Primary accent (red-600) */
--vintage-white: #f5f5f4     /* Primary text (stone-100) */
--dust-gray: #a8a29e         /* Secondary text (stone-400) */
--shadow-black: #0c0a09      /* Background (stone-950) */
--glass-border: #44403c      /* Glass borders (stone-600) */
```

### **Typography**
- **Headlines**: "Newspaper Headline" (custom font)
- **Body**: "Roboto Mono" (monospace for code aesthetic)
- **Hierarchy**: 
  - `text-6xl` for main titles
  - `text-3xl` for section headers
  - `text-lg` for body text

### **Glass Morphism System**
```css
.glass-card {
  background: rgba(68, 64, 60, 0.1);  /* Translucent stone-600 */
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}
```

## 📄 Page Architecture

### **1. Landing Page (`/`)**
**Purpose**: First impression with interactive elements

**Key Features**:
- **Custom Cursor**: `TargetCursor` component that follows mouse
- **Hero Section**: Large typography with call-to-action
- **Navigation**: Links to Story and Projects
- **Aesthetic**: Minimal, focuses attention on typography

**Technical Details**:
- Uses `hideDefaultCursor={true}` to replace system cursor
- Responsive design with mobile-first approach
- Glass morphism cards for navigation

## 🧠 Landing Page Role System

### **The "Rotating Head" Core**
The landing page revolves around an interactive 3D head (`/head.glb`) that acts as a persona toggle. 

- **Component**: `src/components/RoleSelector/RoleSelector.tsx`
- **Engine**: **React Three Fiber** (`ThreeScene.tsx`) handles the GLTF rendering.
- **Interaction**: 
  - **Auto-rotation**: The head spins continuously by default.
  - **Snapping**: Clicking the head locks it to a front-facing "snapped" state for reading role details and navigating to the Story page.
  - **Auto-Sync**: Completing a full rotation (detected via Y-rotation threshold) automatically increments the index to the next role in `src/data/roles.ts`.

### **Dynamic Theming Engine**
Every role/persona (Trader, Quant, Developer) comes with a set of "Theme Tokens" (`primary`, `secondary`, `tertiary`) that are injected into the DOM as CSS variables.

- **Variable Injection**: `BackgroundLandscape.tsx` updates `document.documentElement.style` with colors like `--theme-primary` and `--theme-accent` whenever the `activeIndex` changes.
- **Global Stylings**: Components across the site (the "Read More" button, METR charts, grid streams) use these variables, allowing for an instant, unified aesthetic shift.

### **Component Architecture**
1. **`RoleSelector`**: Parent state container for the active index and lock state.
2. **`ThreeScene`**: The 3D viewport, lighting, and snappy rotation logic.
3. **`BackgroundLandscape`**: Renders the blurred background image layers and handles theme injection.
4. **`RoleDetail`**: Renders the "Story" (Read More) text and CTA for the current role.
5. **`DotNav`**: Pagination indicator for the role sequence.

### **2. Story Page (`/story`)**
**Purpose**: Personal narrative and featured projects

**Key Features**:
- **Personal Story**: Markdown-style content about background
- **Featured Projects**: Curated selection of important repos
- **GitHub Integration**: Profile picture and contribution graph
- **Subtle Navigation**: "View All Projects" link to projects page

**Technical Details**:
- **GitHub Profile**: Fetches user data from GitHub API
- **Featured Repos**: Hardcoded list of important projects
- **Responsive Grid**: 2-column layout on larger screens
- **README Integration**: Shows first paragraph of each featured project

### **3. Projects Page (`/projects`)**
**Purpose**: Dynamic showcase of all GitHub repositories

**Key Features**:
- **Live Data**: Automatically pulls from GitHub API
- **Smart Filtering**: Category-based filtering (Web, AI/ML, Tools, etc.)
- **Language Display**: Shows top 3 programming languages per repo
- **Dual Actions**: "Live Demo" (if homepage exists) + "GitHub" buttons
- **Search**: Real-time filtering by name/description
- **Responsive**: 1-3 columns based on screen size

**Technical Details**:
- **Caching**: 5-minute cache to avoid rate limits
- **Category Logic**: Auto-categorizes based on topics and languages
- **README Parsing**: Shows clean first paragraph from README
- **Error Handling**: Graceful fallbacks for API failures

## 📽️ B-Roll & Visual Accents

### **Orchestration**
The landing page uses a series of "B-Roll" sections to provide social proof and mission context. All of these sections are orchestrated via **GSAP ScrollTrigger** for a professional, "Apple-style" reveal.

- **`Stats.tsx`**: Renders numeric proof (years active, projects completed) with a staggered fade-up entrance.
- **`Philosophy.tsx`**: A double-column text block that explains the user's core methodology, featuring a scroll-bound opacity reveal.
- **`Marquee.tsx`**: A horizontal ticker that loops technical skills or buzzwords to maintain visual interest.
- **`Footer.tsx`**: Minimal contact block that follows the site's monochrome/accent design.

## 📱 Mobile-First Adaptation

### **Hybrid Hero Strategy**
Due to the high performance cost of WebGL (`react-three-fiber`), the portfolio uses a hybrid approach for the Hero section:

- **Desktop**: Renders the full `RoleSelector` (3D head + background layers).
- **Mobile**: Replaces the 3D module with a simple but punchy `Typewriter` component and a static `bg_portrait.png` background. This ensures the site remains lightning-fast and battery-efficient on smaller devices while still feeling interactive.

### **Header & Socials**
- **`HeaderSocials.tsx`**: Stays consistent across all pages (Story, Projects, Landing), providing a persistent anchor point for GitHub and LinkedIn links.

## 🔌 API Architecture

### **Why Proxy APIs?**
**Problem**: Direct GitHub API calls from frontend cause CORS issues and expose tokens
**Solution**: Next.js API routes act as a secure proxy

### **1. Repository API (`/api/github/repos`)**
**Endpoint**: `GET /api/github/repos`

**Features**:
- **Caching**: 5-minute in-memory cache (`CACHE_DURATION = 5 * 60 * 1000`)
- **Authentication**: Uses `GITHUB_TOKEN` environment variable
- **Filtering**: Excludes forks and repos with exclusion topics
- **Language Stats**: Fetches language breakdown for each repo
- **Force Refresh**: `?refresh=true` parameter clears cache

**Data Flow**:
```
Frontend → API Route → GitHub API → Cache → Frontend
```

**Response Format**:
```typescript
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  languages_url: string;
  updated_at: string;
  fork: boolean;
}
```

### **2. README API (`/api/github/readme/[repo]`)**
**Endpoint**: `GET /api/github/readme/[repo]`

**Features**:
- **Caching**: In-memory cache per repository
- **Content Parsing**: Extracts first meaningful paragraph
- **Markdown Cleaning**: Strips formatting, links, code blocks
- **YAML Frontmatter**: Skips Jekyll/Hugo frontmatter

**Parsing Logic**:
```typescript
function extractFirstParagraph(content: string): string {
  // 1. Skip YAML frontmatter (---)
  // 2. Skip headers (# ## ###)
  // 3. Skip code blocks (```)
  // 4. Skip images (![alt](url))
  // 5. Strip markdown formatting (**bold**, *italic*, `code`, [links](url))
  // 6. Return first substantial paragraph
}
```

## 🎯 Key Design Decisions

### **1. Category System**
**Problem**: GitHub topics are inconsistent
**Solution**: Smart categorization based on topics + language

```typescript
const categoryMapping = {
  'Web Development': ['web', 'frontend', 'backend', 'fullstack', 'react', 'nextjs'],
  'AI & Machine Learning': ['ai', 'ml', 'machine-learning', 'data-science'],
  'Tools & Utilities': ['tool', 'utility', 'cli', 'automation'],
  'Mobile Development': ['mobile', 'android', 'ios', 'react-native'],
  'Other': [] // fallback
};
```

### **2. Language Display**
**Problem**: Repos have many languages, clutters UI
**Solution**: Show only top 3 languages with consistent styling

```typescript
function getTopLanguages(languages: Record<string, number>): string[] {
  return Object.entries(languages)
    .sort(([,a], [,b]) => b - a)  // Sort by byte count
    .slice(0, 3)                  // Take top 3
    .map(([lang]) => lang);       // Extract language names
}
```

### **3. Responsive Design**
**Mobile First**: All components designed for mobile, then enhanced
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Typography**: Scales down on mobile
- **Navigation**: Horizontal scroll on mobile for categories

### **4. Performance Optimizations**
- **Caching**: API responses cached for 5 minutes
- **Lazy Loading**: Images and content load as needed
- **Bundle Size**: Removed unused dependencies (`@gradio/client`)
- **Static Export**: Can be deployed to CDN

## 🔧 Environment Setup

### **Required Environment Variables**
```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx    # GitHub Personal Access Token
GITHUB_USERNAME=yourusername             # Your GitHub username
```

### **GitHub Token Permissions**
- `public_repo` (read public repositories)
- `read:user` (read user profile)

## 🚨 Known Issues & Limitations

### **1. Rate Limiting**
- **GitHub API**: 5000 requests/hour with token, 60 without
- **Mitigation**: 5-minute caching, efficient API usage
- **Fallback**: Graceful degradation if API fails

### **2. README Parsing**
- **Complex Markdown**: May not handle all edge cases
- **Images**: Skipped entirely (could show first image as preview)
- **Tables**: Not parsed (could extract key information)

### **3. Category Detection**
- **Manual Topics**: Requires manual topic management on GitHub
- **Language Bias**: Heavily weighted toward primary language
- **Edge Cases**: Some repos may be miscategorized

## 🏗️ Isometric Microstructure System (METR)

### **Design Concept**
Visualizes the **Market Exposure Timing vs Randomness (METR)** study as a live, 3D market floor. The background consists of a large-scale isometric grid that simulates the deterministic "microstructure" of a high-frequency trading environment.

### **Technical Breakdown**
- **Isometric Logic**: Uses CSS `transform: perspective(1200px) rotateX(55deg) rotateZ(-45deg)` on a dual-scale SVG container to create a deep, receding floor effect.
- **GSAP Data Streams**: Specific SVG paths are animated using `stroke-dashoffset` to simulate "data packets" pulsing through the grid along the isometric axes.
- **Theme Sync**: Stroke colors and glow effects (`drop-shadow`) are linked to the `--theme-accent` variable, allowing the background to respond to persona shifts.

### **Mishaps & Lessons Learned**
1. **Z-Index Masking**: 
    - **Problem**: Placing a background with `-z-10` inside a `relative` container with a `bg-color` often renders the background invisible because the parent's fill is layered *above* its negative-z children.
    - **Fix**: Set the parent `section` to `bg-transparent` and move the background fill (`bg-[#0d0d0d]`) into the background component itself at `z-0`, while elevating content to `z-10`.
2. **Opacity Compounding**: 
    - **Problem**: Low opacity on a container (`0.2`) multiplied by low opacity on a stroke (`0.1`) results in total invisibility (~2% net opacity).
    - **Fix**: Boost container base opacity to at least `0.4` and use stronger stroke weights (`1.5px+`) for foreground depth.
3. **SVG Measurement Timing**:
    - **Problem**: `getTotalLength()` can return `0` if called before the SVG has fully rendered.
    - **Fix**: Use a fallback value (e.g., `1000`) in the GSAP initialization to prevent animation "deadlocking".

## 🔮 Future Enhancements

### **Short Term**
1. **Search Improvements**: Fuzzy search, search by language
2. **Sorting Options**: By stars, last updated, name
3. **Project Details**: Modal with full README, stats, contributors
4. **Dark/Light Toggle**: User preference system

### **Medium Term**
1. **GitHub Stats**: Contribution graphs, language statistics
2. **Project Filtering**: By date range, activity level
3. **Performance**: Virtual scrolling for large repo lists
4. **SEO**: Meta tags, structured data, sitemap

### **Long Term**
1. **CMS Integration**: Manage featured projects via CMS
2. **Analytics**: Track popular projects, user engagement
3. **Internationalization**: Multi-language support
4. **PWA**: Offline support, app-like experience

## 🛠️ Development Workflow

### **Local Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Debugging**
- **API Issues**: Check browser network tab, API route logs
- **Styling**: Use browser dev tools, check CSS variable values
- **GitHub API**: Verify token permissions, check rate limits

### **Testing Changes**
1. **Local**: Test on `localhost:3000`
2. **API**: Use `?refresh=true` to bypass cache
3. **Mobile**: Test responsive design on various screen sizes
4. **Performance**: Check bundle size, API response times

## 📚 Key Files to Understand

### **Critical Files** (modify with care)
- `src/app/projects/page.tsx` - Main projects logic
- `src/app/api/github/repos/route.ts` - Repository data API
- `src/app/globals.css` - Design system and variables

### **Configuration Files**
- `tailwind.config.ts` - Tailwind customization
- `next.config.js` - Next.js configuration
- `package.json` - Dependencies and scripts

### **Content Files** (safe to modify)
- `src/app/story/page.tsx` - Personal story content
- `src/app/page.tsx` - Landing page content

---

**This document should be updated whenever significant architectural changes are made to keep it accurate and useful for future development.**
