"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Something didn’t go through
        </h2>

        <p className="text-sm text-gray-600">
          This can happen if the network is slow or the request timed out.
          Your message is safe.
        </p>

        <button
          onClick={() => reset()}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
        >
          🔁 Try again
        </button>

        <p className="text-xs text-gray-400">
          If this keeps happening, refresh once and retry
        </p>
      </div>
    </div>
  );
}
