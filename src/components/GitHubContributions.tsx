import React from "react";

type GitHubContributionsProps = { username: string };

// Revert to the reliable static SVG heatmap (works without API). Colors are handled via `.gh-chart` filter in CSS.
export default function GitHubContributions({ username }: GitHubContributionsProps) {
  return (
    <div className="overflow-x-auto">
      <img
        src={`https://ghchart.rshah.org/cc2936/${username}`}
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


