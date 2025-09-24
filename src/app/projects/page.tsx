'use client';
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  updated_at: string;
  language: string | null;
  languages?: { [key: string]: number };
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  readme?: string;
}

export default function ProjectsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get top languages for a repo, filtering out low-impact languages
  const getTopLanguages = (repo: GitHubRepo): string[] => {
    if (!repo.languages) return repo.language ? [repo.language] : [];
    
    // Languages to deprioritize (usually config/markup)
    const lowPriorityLanguages = ['CSS', 'HTML', 'SCSS', 'Less', 'Stylus', 'Dockerfile', 'Makefile', 'Shell', 'PowerShell'];
    
    // Convert languages object to array and sort by usage
    const languageEntries = Object.entries(repo.languages)
      .map(([lang, bytes]) => ({ lang, bytes, percentage: 0 }));
    
    const totalBytes = languageEntries.reduce((sum, { bytes }) => sum + bytes, 0);
    
    // Calculate percentages and filter
    const processedLanguages = languageEntries
      .map(({ lang, bytes }) => ({
        lang,
        bytes,
        percentage: (bytes / totalBytes) * 100
      }))
      // Filter out languages with < 5% unless they're the only ones
      .filter(({ percentage }) => 
        percentage >= 5 || languageEntries.length <= 3
      )
      // Sort by percentage, but boost important languages
      .sort((a, b) => {
        const aIsLowPriority = lowPriorityLanguages.includes(a.lang);
        const bIsLowPriority = lowPriorityLanguages.includes(b.lang);
        
        // If one is low priority and other isn't, prioritize the non-low-priority
        if (aIsLowPriority && !bIsLowPriority) return 1;
        if (!aIsLowPriority && bIsLowPriority) return -1;
        
        // Otherwise sort by percentage
        return b.percentage - a.percentage;
      })
      .slice(0, 3)
      .map(({ lang }) => lang);
    
    return processedLanguages.length > 0 ? processedLanguages : (repo.language ? [repo.language] : []);
  };

  // Category mapping based on GitHub topics
  const categoryMapping = {
    "ML & AI": [
      "machine-learning", "deep-learning", "artificial-intelligence", "ai",
      "neural-networks", "pytorch", "tensorflow", "computer-vision", "ocr",
      "nlp", "natural-language-processing", "classification", "regression", 
      "crnn", "lstm", "cnn", "rnn", "ctc-loss", "model-training"
    ],
    "Web Development": [
      "web-development", "frontend", "backend", "react", "nextjs", "javascript",
      "typescript", "html", "css", "tailwind", "responsive", "portfolio",
      "website", "web-app", "dashboard", "monitoring", "full-stack"
    ],
    "Data Science": [
      "jupyter", "notebook", "data-analysis", "visualization", "pandas",
      "numpy", "matplotlib", "seaborn", "finance", "stock-prediction",
      "healthcare", "medical", "energy", "solar", "analytics", "statistics"
    ],
    "Mobile Development": [
      "mobile", "android", "ios", "react-native", "flutter", "swift",
      "kotlin", "mobile-app", "cross-platform", "native"
    ],
    "DevOps & Cloud": [
      "devops", "docker", "kubernetes", "aws", "azure", "gcp", "cloud",
      "deployment", "ci-cd", "infrastructure", "terraform", "ansible"
    ],
    "Game Development": [
      "game", "unity", "unreal", "gaming", "3d", "2d", "gamedev",
      "graphics", "simulation", "entertainment"
    ],
    "Blockchain & Crypto": [
      "blockchain", "crypto", "ethereum", "bitcoin", "smart-contracts",
      "web3", "defi", "nft", "solidity", "cryptocurrency"
    ],
    "Systems & Applications": [
      "cpp", "c++", "desktop-application", "system", "application",
      "management-system", "hospital", "cli", "automation", "tools",
      "embedded", "low-level"
    ],
    "Security & Privacy": [
      "security", "cybersecurity", "encryption", "privacy", "penetration-testing",
      "vulnerability", "auth", "authentication", "cryptography"
    ]
  };

  // Function to determine category based on topics and language
  const getProjectCategory = useCallback((repo: GitHubRepo): string => {
    const allKeywords = [...repo.topics, repo.language?.toLowerCase() || ""];
    
    for (const [category, keywords] of Object.entries(categoryMapping)) {
      if (keywords.some(keyword => 
        allKeywords.some(topic => 
          topic.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(topic.toLowerCase())
        )
      )) {
        return category;
      }
    }
    
    // Fallback based on language
    if (repo.language) {
      const lang = repo.language.toLowerCase();
      if (["python"].includes(lang) && repo.topics.length === 0) return "Data Science";
      if (["javascript", "typescript", "html", "css"].includes(lang)) return "Web Development";
      if (["c++", "c"].includes(lang)) return "Systems & Applications";
    }
    
    return "Other";
  }, [categoryMapping]);

  // Get unique categories from repos
  const getAvailableCategories = (): string[] => {
    const categories = new Set<string>();
    repos.forEach(repo => {
      categories.add(getProjectCategory(repo));
    });
    return ["All", ...Array.from(categories).sort()];
  };

  // Fetch GitHub repos
  const fetchRepos = async (forceRefresh = false) => {
    try {
      setLoading(true);
      if (forceRefresh) setRefreshing(true);
      
      // Fetch repos from our API route with optional refresh
      const url = forceRefresh ? '/api/github/repos?refresh=true' : '/api/github/repos';
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.log('API Error:', response.status, errorData);
        throw new Error(`Failed to fetch repositories: ${response.status}`);
      }
      
      const repoData: GitHubRepo[] = await response.json();
      
      // Optionally fetch README for featured repos (limit to prevent rate limiting)
      const reposWithReadme = await Promise.all(
        repoData.slice(0, 10).map(async (repo) => {
          try {
            const readmeResponse = await fetch(`/api/github/readme/${repo.name}`);
            
            if (readmeResponse.ok) {
              const readmeData = await readmeResponse.json();
              return { ...repo, readme: readmeData.firstParagraph };
            }
        } catch {
          // Could not fetch README
        }
          return repo;
        })
      );
      
      setRepos(reposWithReadme);
      setFilteredRepos(reposWithReadme);
      } catch {
        // Error fetching repositories
      } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchRepos(true);
  };


  // Filter repos based on search term and category
  useEffect(() => {
    let filtered = repos;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(repo => getProjectCategory(repo) === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRepos(filtered);
  }, [repos, searchTerm, selectedCategory, getProjectCategory]);



  return (
    <main className="min-h-screen px-6 py-16">
      {/* Hamburger button */}
      <button
        aria-label="Open menu"
        className="fixed top-5 left-4 sm:top-6 sm:left-6 z-30 p-3 rounded-md border border-[var(--spider-red)] bg-[var(--newsprint-gray)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
        onClick={() => setMenuOpen(true)}
      >
        <span className="block w-7 h-[3px] bg-[var(--vintage-white)] mb-1" />
        <span className="block w-7 h-[3px] bg-[var(--vintage-white)] mb-1" />
        <span className="block w-7 h-[3px] bg-[var(--vintage-white)]" />
      </button>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left sidebar */}
      <aside
        className={`fixed top-0 left-0 z-60 h-full w-72 glass-nav transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Projects navigation"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--spider-red)]/40">
          <span className="newspaper-headline text-2xl">Menu</span>
          <button
            aria-label="Close menu"
            className="p-2 rounded-md border border-[var(--spider-red)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="px-4 py-3 space-y-2">
          <Link href="/" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/story" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Story</Link>
          <Link href="/projects" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Projects</Link>
        </nav>
      </aside>

      {/* Back to Story button */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link 
          href="/story" 
          className="inline-flex items-center gap-2 text-[var(--vintage-white)] hover:text-[var(--spider-red)] transition-colors duration-200"
        >
          <span>←</span>
          <span>Back to Story</span>
        </Link>
      </div>

      <section className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center mt-5 animate-slide-down">
          <h1 className="newspaper-headline text-6xl md:text-7xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            My Projects
          </h1>
          <p className="text-xl text-[var(--dust-gray)] mt-4 max-w-3xl mx-auto">
            Live projects pulled directly from GitHub with automatic updates
          </p>
        </header>

        {/* Search and Filter Controls */}
        <div className="mb-8 glass-card p-6 hover:!transform-none hover:!scale-100">
          {/* Category Filters */}
          <div className="mb-6">
            <h3 className="text-lg mb-3 text-[var(--vintage-white)]">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {getAvailableCategories().map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-[var(--spider-red)] text-[var(--vintage-white)] shadow-lg'
                      : 'bg-[var(--newsprint-gray)] text-[var(--dust-gray)] border border-[var(--spider-red)]/40 hover:bg-[var(--spider-red)]/20 hover:text-[var(--vintage-white)]'
                  }`}
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-2 text-xs opacity-75">
                      ({repos.filter(repo => getProjectCategory(repo) === category).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar with Refresh Button */}
          <div className="mb-6 flex gap-3">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 bg-[var(--newsprint-gray)] border border-[var(--spider-red)]/40 rounded-lg text-[var(--vintage-white)] placeholder-[var(--dust-gray)] focus:border-[var(--spider-red)] focus:outline-none transition"
            />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`px-4 py-3 border border-[var(--spider-red)] rounded-lg text-[var(--vintage-white)] transition-all duration-200 ${
                refreshing 
                  ? 'bg-[var(--spider-red)]/20 cursor-not-allowed' 
                  : 'bg-[var(--newsprint-gray)] hover:bg-[var(--spider-red)] hover:scale-105'
              }`}
              title="Refresh projects from GitHub"
            >
              {refreshing ? (
                <div className="w-5 h-5 border-2 border-[var(--vintage-white)] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
              )}
            </button>
          </div>


          {/* Results count */}
          <div className="mt-4 text-sm text-[var(--dust-gray)]">
            Showing {filteredRepos.length} of {repos.length} projects
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-[var(--spider-red)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[var(--dust-gray)]">Fetching projects from GitHub...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="glass-card p-5 hover:!transform-none hover:!scale-100 relative flex flex-col h-full min-h-[280px]">
                {/* Action buttons in top-right */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {/* GitHub button - always visible */}
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-[var(--spider-red)]/20 border border-[var(--spider-red)]/40 text-[var(--vintage-white)] hover:bg-[var(--spider-red)] hover:scale-105 transition-all duration-200 group"
                    title="View on GitHub"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform duration-200">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </Link>

                  {/* Live Demo button - only show if there's a homepage URL */}
                  {repo.homepage && (
                    <Link
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[var(--spider-red)]/20 border border-[var(--spider-red)]/40 text-[var(--vintage-white)] hover:bg-[var(--spider-red)] hover:scale-105 transition-all duration-200 group"
                      title="View live demo"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-12 transition-transform duration-200">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15,3 21,3 21,9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </Link>
                  )}
                </div>
                
                <h3 className="text-2xl mb-3 pr-10">
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-[var(--spider-red)] transition-colors"
                  >
                    {repo.name}
                  </a>
                </h3>
                
                <div className="flex-grow mb-4">
                  <p className="text-[var(--dust-gray)] text-base leading-relaxed min-h-[60px]">
                    {repo.readme || repo.description || "No description available"}
                  </p>
                </div>

                {/* Bottom section with consistent positioning */}
                <div className="mt-auto space-y-3">
                  {/* Language indicators */}
                  <div>
                    {getTopLanguages(repo).length > 0 && (
                      <div className="flex flex-wrap items-center gap-3">
                        {getTopLanguages(repo).map((lang) => (
                          <span key={lang} className="flex items-center gap-1.5 text-xs text-[var(--dust-gray)]">
                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--spider-red)]"></span>
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats - stars and forks */}
                  {(repo.stargazers_count > 0 || repo.forks_count > 0) && (
                    <div className="flex items-center gap-3 text-xs text-[var(--dust-gray)]">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          ⭐ {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          🍴 {repo.forks_count}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Category Badge - Bottom Right */}
                  <div className="flex justify-end">
                    <span className="px-2 py-1 text-xs font-medium bg-[var(--spider-red)]/20 text-[var(--spider-red)] rounded border border-[var(--spider-red)]/40">
                      {getProjectCategory(repo)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && filteredRepos.length === 0 && repos.length > 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--dust-gray)] text-lg">No projects match your current filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="mt-4 spider-noir-button px-6 py-2 border-2 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
