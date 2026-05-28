import { useState, useEffect } from 'react';

const GITHUB_USERNAME = 'harshkumar02';

export function useGitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true);

        // Fetch user's public repos, sorted by updated date
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=public`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }

        const data = await response.json();

        // Filter out forks and format repos
        const formattedRepos = data
          .filter(repo => !repo.fork) // Exclude forked repos
          .map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || 'No description available',
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            topics: repo.topics || [],
            updatedAt: repo.updated_at,
            createdAt: repo.created_at,
          }));

        setRepos(formattedRepos);
        setError(null);
      } catch (err) {
        console.error('GitHub API error:', err);
        setError('Failed to load repositories');
        // Fallback to cached data
        try {
          const cached = localStorage.getItem('github_repos');
          if (cached) {
            setRepos(JSON.parse(cached));
          }
        } catch (cacheErr) {
          console.error('Cache error:', cacheErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();

    // Cache repos in localStorage
    const interval = setInterval(fetchRepos, 30 * 60 * 1000); // Refresh every 30 mins
    return () => clearInterval(interval);
  }, []);

  return { repos, loading, error };
}

// Hook for fetching GitHub profile stats
export function useGitHubStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&type=public`),
        ]);

        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();

          // Calculate total stars
          const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);

          // Get language counts
          const languageCounts = {};
          reposData.forEach(repo => {
            if (repo.language) {
              languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
          });

          setStats({
            publicRepos: userData.public_repos,
            followers: userData.followers,
            following: userData.following,
            totalStars,
            languageCounts,
            avatarUrl: userData.avatar_url,
          });
        }
      } catch (err) {
        console.error('GitHub stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}
