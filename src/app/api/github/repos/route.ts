import { NextResponse } from 'next/server';

// In-memory cache
let cachedRepos: unknown[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Helper function to clear cache (useful for development)
function clearCache() {
  cachedRepos = null;
  lastFetchTime = 0;
  console.log('GitHub repos cache cleared');
}

export async function GET(request: Request) {
  const now = Date.now();
  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get('refresh') === 'true';
  
  try {
    // Clear cache if force refresh requested
    if (forceRefresh) {
      clearCache();
      console.log('Force refresh requested - cache cleared');
    }
    
    // Return cached data if still valid and not force refreshing
    if (cachedRepos && now - lastFetchTime < CACHE_DURATION && !forceRefresh) {
      console.log('Serving cached GitHub repos');
      return NextResponse.json(cachedRepos);
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

    // Update cache with repos
    cachedRepos = reposWithLanguages;
    lastFetchTime = now;
    
    console.log(`Fetched ${reposWithLanguages.length} repos from GitHub API (${originalRepos.length - filteredRepos.length} excluded)`);
    return NextResponse.json(reposWithLanguages);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    
    // Return cached data if available, even on error
    if (cachedRepos) {
      console.log('Error occurred, serving cached data as fallback');
      return NextResponse.json(cachedRepos);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
