import { NextResponse } from 'next/server';

// In-memory cache for README files
const readmeCache = new Map<string, { content: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ repo: string }> }
) {
  try {
    const { repo } = await params;
    const now = Date.now();
    
    // Check cache first
    const cached = readmeCache.get(repo);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      console.log(`Serving cached README for ${repo}`);
      return NextResponse.json(cached.content);
    }

    // Prepare headers with optional GitHub token
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'portfolio-noir',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const username = process.env.GITHUB_USERNAME || 'mohakapoor';

    // Fetch README from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repo}/readme`,
      { headers }
    );

    if (!response.ok) {
      // Check cache for fallback even on error
      const cached = readmeCache.get(repo);
      if (cached) {
        console.log(`README API failed for ${repo}, serving stale cached data`);
        return NextResponse.json(cached.content);
      }
      
      // README not found or other error
      return NextResponse.json(
        { error: 'README not found' },
        { status: 404 }
      );
    }

    const readmeData = await response.json();
    
    // Decode base64 content
    const readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
    
    // Extract first meaningful paragraph (skip headers and empty lines)
    const firstParagraph = readmeContent
      .split('\n')
      .find(line => line.trim() && !line.startsWith('#') && !line.startsWith('!['))
      ?.trim()
      .slice(0, 200);

    const result = {
      content: readmeContent,
      firstParagraph: firstParagraph || null,
    };

    // Cache the result
    readmeCache.set(repo, { content: result, timestamp: now });
    console.log(`Cached README for ${repo}`);

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error fetching README:`, error);
    
    // Get repo from params again since it's out of scope
    const { repo } = await params;
    
    // Return cached data if available, even on error
    const cached = readmeCache.get(repo);
    if (cached) {
      console.log(`Error occurred for ${repo}, serving cached README as fallback`);
      return NextResponse.json(cached.content);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch README' },
      { status: 500 }
    );
  }
}
