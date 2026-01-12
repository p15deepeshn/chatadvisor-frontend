"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2000);
    const t2 = setTimeout(() => setStep(2), 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center space-y-4 max-w-sm w-full">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Primary message */}
        <p className="text-lg font-medium text-gray-900">
          {step === 0 && "Reading the message…"}
          {step === 1 && "Preparing a reply you can send…"}
          {step === 2 && "Almost done…"}
        </p>

        {/* Secondary reassurance */}
        <p className="text-sm text-gray-500">
          {step < 2
            ? "This usually takes a few seconds"
            : "Thanks for waiting"}
        </p>
      </div>
    </div>
  );
}
