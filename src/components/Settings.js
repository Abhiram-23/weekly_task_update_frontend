import { useState } from "react";

export default function Settings({ session, backendUrl }) {
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [reminder, setReminder] = useState("17:00");
  const [pdfOn, setPdfOn] = useState(true);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const res = await fetch(
      `${backendUrl}/entries/settings/${session.user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          timezone,
          reminder_h: parseInt(reminder.split(":")[0], 10),
          reminder_m: parseInt(reminder.split(":")[1], 10),
          pdf_on: pdfOn,
        }),
      }
    );
    if (res.ok) {
      setMessage("Settings saved!");
    } else {
      const data = await res.json();
      setMessage(data.detail || "Error saving settings.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Settings
        </h2>
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Timezone:</span>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </label>
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">Reminder Time:</span>
          <input
            type="time"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>
        <label className="block mb-4">
          <span className="block mb-1 font-semibold">PDF Weekly Report:</span>
          <input
            type="checkbox"
            checked={pdfOn}
            onChange={(e) => setPdfOn(e.target.checked)}
            className="mr-2"
          />
          <span>Receive weekly summary as PDF</span>
        </label>
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold mb-2"
        >
          Save Settings
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
