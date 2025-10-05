// src/components/LivePreview.tsx
import React from "react";

interface LivePreviewProps {
    color?: string;
    text?: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ color = "#000", text = "BMW S1000RR" }) => {
    return (
        <div
            className="border rounded-xl p-6 text-center shadow-lg"
            style={{ backgroundColor: color, color: "#fff", minHeight: "200px", transition: "0.3s" }}
        >
            <h2 className="text-2xl font-bold">{text}</h2>
            <img
                src="/s1000rr.png"
                alt="BMW S1000RR"
                className="mx-auto mt-4"
                style={{ maxHeight: "120px" }}
            />
        </div>
    );
};

export default LivePreview;
