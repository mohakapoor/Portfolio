'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  language: string | null;
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

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

  // Get all unique topics for filtering
  const allTopics = Array.from(new Set(repos.flatMap(repo => repo.topics))).sort();

  // Filter repos based on search term and selected tags
  useEffect(() => {
    let filtered = repos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(repo =>
        selectedTags.some(tag => repo.topics.includes(tag))
      );
    }

    setFilteredRepos(filtered);
  }, [repos, searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };


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
          <div className="mt-4 text-dust-gray">Featured Projects</div>
          <Link href="/projects/CaptchaOCR" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>CaptchaOCR</Link>
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

          {/* Topic Tags Filter */}
          {allTopics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--vintage-white)] mb-3">Filter by Topics</h3>
              <div className="flex flex-wrap gap-2">
                {allTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleTag(topic)}
                    className={`tag cursor-pointer transition-all duration-200 ${
                      selectedTags.includes(topic)
                        ? 'bg-[var(--spider-red)] border-[var(--spider-red)]'
                        : 'hover:bg-[var(--spider-red)]/20'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

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
          <div className="grid gap-6 md:grid-cols-2">
            {filteredRepos.map((repo) => (
              <div key={repo.id} className="glass-card p-5 hover:!transform-none hover:!scale-100 relative flex flex-col h-full min-h-[280px]">
                {/* View Details button for CaptchaOCR only */}
                {repo.name === "CaptchaOCR" && (
                  <Link
                    href="/projects/CaptchaOCR"
                    className="absolute top-4 right-4 p-2 rounded-lg bg-[var(--spider-red)]/20 border border-[var(--spider-red)]/40 text-[var(--vintage-white)] hover:bg-[var(--spider-red)] hover:scale-105 transition-all duration-200 group"
                    title="View detailed project page"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-12 transition-transform duration-200">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </Link>
                )}
                
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
                  {/* Language indicator */}
                  <div>
                    {repo.language && (
                      <span className="flex items-center gap-2 text-xs text-[var(--dust-gray)]">
                        <span className="w-3 h-3 rounded-full bg-[var(--spider-red)]"></span>
                        {repo.language}
                      </span>
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

                  {/* Topics */}
                  {repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {repo.topics.map(topic => (
                        <span key={topic} className="tag">
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
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
                setSelectedTags([]);
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
