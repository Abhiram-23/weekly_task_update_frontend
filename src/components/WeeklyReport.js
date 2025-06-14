import { useState } from "react";

export default function WeeklyReport({ session, backendUrl }) {
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    if (!weekStart) return;
    setLoading(true);
    setSummary("");
    setMessage("");
    try {
      const res = await fetch(
        `${backendUrl}/entries/weekly/${session.user.id}?week_start=${weekStart}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const geminiRes = await fetch(`${backendUrl}/entries/gemini/summary`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            user_id: session.user.id,
            week_start: weekStart,
            week_end: weekEnd,
            entries: data.entries,
          }),
        });
        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          setSummary(geminiData.summary);
          setMessage("");
        } else {
          setMessage("Error generating summary.");
        }
      } else {
        setMessage("Error fetching weekly entries.");
      }
    } catch (err) {
      setMessage("An error occurred while generating the report.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg relative">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Weekly Report
        </h2>
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold mb-4"
          disabled={loading}
        >
          Generate Weekly Summary
        </button>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <form
              onSubmit={handleModalSubmit}
              className="bg-white p-6 rounded shadow-md w-full max-w-xs flex flex-col items-center"
            >
              <label className="mb-2 font-semibold">
                Select week start date (Monday):
              </label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <label className="mb-2 font-semibold">
                Select week end date (Friday or any date):
              </label>
              <input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                className="mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex space-x-2 w-full">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
                  disabled={loading}
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition-colors font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-50">
            <svg
              className="animate-spin h-10 w-10 text-blue-600 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-blue-700 font-semibold">Generating...</span>
          </div>
        )}
        {summary && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-blue-700 mr-2">
                Summary:
              </h3>
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="ml-2 p-1 rounded hover:bg-blue-100 focus:outline-none border border-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 16v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2"
                  />
                </svg>
              </button>
              {copied && (
                <span className="ml-2 text-green-600 text-sm">Copied!</span>
              )}
            </div>
            <p className="bg-gray-100 p-4 rounded text-gray-800 whitespace-pre-line">
              {summary}
            </p>
          </div>
        )}
        {message && (
          <div className="mt-2 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
