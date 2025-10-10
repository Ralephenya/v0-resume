import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

interface SubmissionFormProps {
    onSuccess: (url: string) => void;
    onStepChange: (step: number) => void;
}

export default function SubmissionForm({ onSuccess, onStepChange }: SubmissionFormProps) {
    const [pictureUrl, setPictureUrl] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const simulateDeployment = async () => {
        const steps = [
            { step: 1, delay: 800, message: "Creating branch..." },
            { step: 2, delay: 1200, message: "Pushing code..." },
            { step: 3, delay: 1500, message: "Running CI checks..." },
            { step: 4, delay: 1800, message: "Building container..." },
            { step: 5, delay: 1000, message: "Deploying to live..." },
        ];

        for (const { step, delay, message } of steps) {
            console.log(message);
            onStepChange(step);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // Simulate live URL generation
        const mockLiveUrl = `https://preview-${Date.now()}.ephemeral.dev`;
        onSuccess(mockLiveUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!pictureUrl.trim()) {
            setError("Picture URL is required");
            return;
        }

        if (!pictureUrl.match(/^https?:\/\/.+/)) {
            setError("Please enter a valid URL starting with http:// or https://");
            return;
        }

        if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        try {
            // Mock API call - replace with your real endpoint
            // await fetch("/api/deploy", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ pictureUrl, email }),
            // });

            await simulateDeployment();
        } catch (err) {
            setError("Deployment failed. Please try again.");
            onStepChange(0);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-4">
                {/* Picture URL Input */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 block text-left">
                        Picture URL <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={pictureUrl}
                        onChange={(e) => setPictureUrl(e.target.value)}
                        disabled={isSubmitting}
                        className="text-base py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-all disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 text-left">
                        We need a picture URL to generate your live preview
                    </p>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-400 block text-left">
                        Email
                    </label>
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="text-base py-3 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                    />
                    <p className="text-xs text-gray-500 text-left">
                        Get notified when your preview is ready and help us prevent spam
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg py-4 font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-red-500/30 group"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            DEPLOYING...
          </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
            <Zap className="h-5 w-5 group-hover:animate-pulse" />
            REV THE ENGINE
          </span>
                )}
            </Button>
        </form>
    );
}