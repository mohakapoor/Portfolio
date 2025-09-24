import { NextResponse } from 'next/server';

// In-memory cache
let cachedRepos: unknown[] | null = null;
let cachedStats: unknown = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Helper function to clear cache (useful for development)
function clearCache() {
  cachedRepos = null;
  cachedStats = null;
  lastFetchTime = 0;
  console.log('GitHub repos and stats cache cleared');
}

export async function GET(request: Request) {
  const now = Date.now();
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  const statsOnly = url.searchParams.get('stats') === 'true';
  
  try {
    
    // Clear cache if force refresh requested
    if (forceRefresh) {
      clearCache();
      console.log('Force refresh requested - cache cleared');
    }
    
    // Return cached data if still valid and not force refreshing
    if (cachedRepos && cachedStats && now - lastFetchTime < CACHE_DURATION && !forceRefresh) {
      console.log('Serving cached GitHub data');
      return NextResponse.json(statsOnly ? cachedStats : { repos: cachedRepos, stats: cachedStats });
    }

    // Prepare headers with optional GitHub token
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.mercy-preview+json', // For topics
      'User-Agent': 'portfolio-noir',
    };

    // Add GitHub token if available (increases rate limit to 5,000/hour)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      console.log('Using GitHub token for authenticated requests');
    } else {
      console.log('No GitHub token found, using unauthenticated requests (60/hour limit)');
    }

    const username = process.env.GITHUB_USERNAME || 'mohakapoor';
    
    // Fetch repos from GitHub API
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=50`,
      { headers }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API error ${response.status}:`, errorText);
      
      // If we have cached data, return it even if stale
      if (cachedRepos) {
        console.log('GitHub API failed, serving stale cached data');
        return NextResponse.json(cachedRepos);
      }
      
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const repos = await response.json();

    // Filter out forked repos and focus on original projects
    const originalRepos = repos.filter((repo: { fork?: boolean }) => !repo.fork);
    
    // Filter out repos with exclusion topics (portfolio, private, hidden, etc.)
    const exclusionTopics = ['portfolio', 'private', 'hidden', 'exclude', 'personal'];
    const filteredRepos = originalRepos.filter((repo: { topics?: string[] }) => 
      !exclusionTopics.some(topic => repo.topics?.includes(topic))
    );

    // Fetch language statistics for each repo (limit to prevent rate limiting)
    const reposWithLanguages = await Promise.all(
      filteredRepos.slice(0, 15).map(async (repo: { name: string; [key: string]: unknown }) => {
        try {
          const langResponse = await fetch(
            `https://api.github.com/repos/${username}/${repo.name}/languages`,
            { headers }
          );
          
          if (langResponse.ok) {
            const languages = await langResponse.json();
            return { ...repo, languages };
          }
        } catch {
          // Language fetch failed, keep repo without languages
        }
        return repo;
      })
    );

    // Calculate stats from the repos
    const languages = new Set<string>();
    reposWithLanguages.forEach((repo: { language?: string; [key: string]: unknown }) => {
      if (repo.language) {
        languages.add(repo.language);
      }
    });

    // Estimate total commits (GitHub doesn't provide this easily)
    let totalCommits = 0;
    try {
      const eventsResponse = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=100`,
        { headers }
      );
      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        totalCommits = events.filter((event: { type?: string; [key: string]: unknown }) => event.type === 'PushEvent').length * 5;
        
        if (totalCommits < 50) {
          totalCommits = Math.max(reposWithLanguages.length * 10, 100);
        }
      }
    } catch {
      totalCommits = Math.max(reposWithLanguages.length * 15, 200);
    }

    // Fetch user data for additional stats
    let followers = 0;
    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        followers = userData.followers || 0;
      }
    } catch {
      // User data fetch failed
    }

    const stats = {
      totalRepos: reposWithLanguages.length,
      totalCommits: totalCommits,
      languages: Array.from(languages).slice(0, 5),
      followers: followers
    };

    // Update cache with both repos and stats
    cachedRepos = reposWithLanguages;
    cachedStats = stats;
    lastFetchTime = now;
    
    console.log(`Fetched ${reposWithLanguages.length} repos from GitHub API (${originalRepos.length - filteredRepos.length} excluded)`);
    
    // Return based on what was requested
    return NextResponse.json(statsOnly ? stats : { repos: reposWithLanguages, stats });
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    
    // Return cached data if available, even on error
    if (cachedRepos && cachedStats) {
      console.log('Error occurred, serving cached data as fallback');
      return NextResponse.json(statsOnly ? cachedStats : { repos: cachedRepos, stats: cachedStats });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
