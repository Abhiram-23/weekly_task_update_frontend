import { useEffect, useState, useRef } from "react";

export default function WeeklyReportsList({ session, backendUrl }) {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("");
  const [colWidths, setColWidths] = useState({
    week_start: 150,
    week_end: 150,
    summary: 400,
    sent_at: 180,
  });
  const resizingCol = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch(
          `${backendUrl}/entries/weekly_reports/${session.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        } else {
          setMessage("Error fetching weekly reports.");
        }
      } catch (err) {
        setMessage("Error fetching weekly reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [session, backendUrl]);

  // Filtering
  const filteredReports = reports.filter(
    (r) =>
      r.summary.toLowerCase().includes(filter.toLowerCase()) ||
      r.week_start.includes(filter) ||
      r.week_end.includes(filter)
  );

  // Column resizing handlers
  const handleMouseDown = (col, e) => {
    resizingCol.current = col;
    startX.current = e.clientX;
    startWidth.current = colWidths[col];
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e) => {
    if (!resizingCol.current) return;
    const diff = e.clientX - startX.current;
    setColWidths((prev) => ({
      ...prev,
      [resizingCol.current]: Math.max(80, startWidth.current + diff),
    }));
  };
  const handleMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Weekly Reports History
        </h2>
        <input
          type="text"
          placeholder="Filter by summary or date..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 px-3 py-2 border border-gray-300 rounded w-full max-w-md"
        />
        {loading && (
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
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
          </div>
        )}
        {message && (
          <div className="mb-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
        {reports.length === 0 && !loading ? (
          <div className="text-center text-gray-500">
            No weekly reports found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max bg-white border rounded">
              <thead>
                <tr>
                  <th
                    style={{ width: colWidths.week_start }}
                    className="border-b px-2 py-2 text-left relative"
                  >
                    Week Start
                    <span
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => handleMouseDown("week_start", e)}
                    ></span>
                  </th>
                  <th
                    style={{ width: colWidths.week_end }}
                    className="border-b px-2 py-2 text-left relative"
                  >
                    Week End
                    <span
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => handleMouseDown("week_end", e)}
                    ></span>
                  </th>
                  <th
                    style={{ width: colWidths.summary }}
                    className="border-b px-2 py-2 text-left relative"
                  >
                    Summary
                    <span
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => handleMouseDown("summary", e)}
                    ></span>
                  </th>
                  <th
                    style={{ width: colWidths.sent_at }}
                    className="border-b px-2 py-2 text-left relative"
                  >
                    Sent At
                    <span
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                      onMouseDown={(e) => handleMouseDown("sent_at", e)}
                    ></span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td
                      className="border-b px-2 py-2"
                      style={{ width: colWidths.week_start }}
                    >
                      {r.week_start}
                    </td>
                    <td
                      className="border-b px-2 py-2"
                      style={{ width: colWidths.week_end }}
                    >
                      {r.week_end}
                    </td>
                    <td
                      className="border-b px-2 py-2"
                      style={{ width: colWidths.summary }}
                    >
                      {r.summary}
                    </td>
                    <td
                      className="border-b px-2 py-2"
                      style={{ width: colWidths.sent_at }}
                    >
                      {new Date(r.sent_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
