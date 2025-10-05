// src/components/ProgressTracker.tsx
import React from "react";

interface ProgressTrackerProps {
    step: number;
}

const steps = [
    "Branch Created",
    "Commit & PR",
    "Pipeline Triggered",
    "Test Env Deployed",
    "Email Sent",
];

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ step }) => {
    return (
        <div className="flex flex-col space-y-3">
            {steps.map((label, index) => (
                <div key={index} className="flex items-center">
                    <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            index <= step ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                        }`}
                    >
                        {index < step ? "✓" : index + 1}
                    </div>
                    <span className="ml-4 font-semibold">{label}</span>
                </div>
            ))}
        </div>
    );
};

export default ProgressTracker;
