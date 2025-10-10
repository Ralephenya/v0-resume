// src/services/githubStats.ts

export interface GitHubStatsRequest {
    maxRepositories: number;
    includePrivateRepos: boolean;
}

export interface GitHubStatsResponse {
    success: boolean;
    message: string;
    username: string;
    totalCommits: number;
    totalPullRequests: number;
    currentStreak: number;
    totalContributionDays: number;
}

export async function getGitHubStats(): Promise<GitHubStatsResponse> {
    const response = await fetch(
        'https://ulzzdhifxiwhqcdj6i6oj4imvm0kgkmy.lambda-url.af-south-1.on.aws/api/GitHub/comprehensive-stats',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/plain'
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Error fetching GitHub stats: ${response.statusText}`);
    }

    // The Lambda currently returns text, so we parse it as JSON
    const data = await response.text();
    return JSON.parse(data) as GitHubStatsResponse;
}
