import { useState } from "react";

export default function DailyEntry({ session, backendUrl }) {
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!entry.trim()) {
      setMessage("Entry cannot be empty.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const res = await fetch(`${backendUrl}/entries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        user_id: session.user.id,
        date: today,
        text: entry,
      }),
    });
    if (res.ok) {
      setMessage("Entry saved!");
      setEntry("");
    } else {
      const data = await res.json();
      setMessage(data.detail || "Error saving entry.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Daily Log Entry
        </h2>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="What did you work on today?"
          rows={4}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold mb-2"
        >
          Save Entry
        </button>
        {message && (
          <div className="mt-2 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
