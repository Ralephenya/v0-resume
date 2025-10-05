// src/utils/api.ts
export interface StatsRequest {
    maxRepositories: number;
    includePrivateRepos: boolean;
}

export interface StatsResponse {
    success: boolean;
    message: string;
    data: any;
    generatedAt: string;
}

export const fetchGitHubStats = async (request: StatsRequest): Promise<StatsResponse> => {
    const response = await fetch(
        "https://ulzzdhifxiwhqcdj6i6oj4imvm0kgkmy.lambda-url.af-south-1.on.aws/api/GitHub/stats",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain",
            },
            body: JSON.stringify(request),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch GitHub stats");
    }

    return response.json();
};

// Simulated Lambda function for CI/CD trigger
export const triggerCICD = async (payload: any): Promise<{ url: string; message: string }> => {
    const response = await fetch("/api/triggerCICD", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("CI/CD pipeline failed");
    return response.json();
};
