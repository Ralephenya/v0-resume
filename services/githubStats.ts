// src/services/githubStats.ts

export interface GitHubStatsRequest {
    maxRepositories: number;
    includePrivateRepos: boolean;
}

export interface GitHubStatsResponse {
    success: boolean;
    message: string;
    data: {
        username: string;
        name: string | null;
        totalCommits: number;
        totalPullRequests: number;
        dayStreak: number;
        totalContributions: number;
        publicRepos: number;
        followers: number;
        following: number;
        contributionsByRepo: Record<string, number>;
        recentActivity: string[];
    };
    generatedAt: string;
}

export async function getGitHubStats(request: GitHubStatsRequest): Promise<GitHubStatsResponse> {
    const response = await fetch(
        'https://ulzzdhifxiwhqcdj6i6oj4imvm0kgkmy.lambda-url.af-south-1.on.aws/api/GitHub/stats',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/plain'
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching GitHub stats: ${response.statusText}`);
    }

    // The Lambda currently returns text, so we parse it as JSON
    const data = await response.text();
    return JSON.parse(data) as GitHubStatsResponse;
}
