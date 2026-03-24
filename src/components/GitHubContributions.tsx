import React, { useEffect, useState } from "react";

type GitHubContributionsProps = { username: string };

// Pulls theme accent dynamically to match current site role
export default function GitHubContributions({ username }: GitHubContributionsProps) {
  const [accentColor, setAccentColor] = useState("cc2936"); // Default ML Red

  useEffect(() => {
    // Fetch the current theme accent from CSS variables
    const root = document.documentElement;
    const themeColor = getComputedStyle(root).getPropertyValue('--theme-accent').trim();
    
    if (themeColor && themeColor.startsWith('#')) {
      setAccentColor(themeColor.replace('#', ''));
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <img
        src={`https://ghchart.rshah.org/${accentColor}/${username}`}
        alt={`GitHub contribution chart for ${username}`}
        referrerPolicy="no-referrer"
        style={{
          minWidth: '600px',
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  );
}
