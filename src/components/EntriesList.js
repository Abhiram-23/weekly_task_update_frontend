import { useEffect, useState, useRef } from "react";

export default function EntriesList({ session, backendUrl }) {
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [colWidths, setColWidths] = useState({
    date: 140,
    text: 400,
    actions: 120,
  });
  const resizingCol = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch(
          `${backendUrl}/entries/?user_id=${session.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        } else {
          setMessage("Error fetching entries.");
        }
      } catch (err) {
        setMessage("Error fetching entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [session, backendUrl]);

  const handleEdit = (entry) => {
    setEditingId(entry.entry_id);
    setEditText(entry.text);
  };

  const handleSave = async (entry) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${backendUrl}/entries/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ entry_id: entry.entry_id, text: editText }),
      });
      if (res.ok) {
        setEntries(
          entries.map((e) =>
            e.entry_id === entry.entry_id ? { ...e, text: editText } : e
          )
        );
        setEditingId(null);
        setEditText("");
        setMessage("Entry updated!");
      } else {
        setMessage("Error updating entry.");
      }
    } catch (err) {
      setMessage("Error updating entry.");
    } finally {
      setLoading(false);
    }
  };

  // Filtering
  const filteredEntries = entries.filter(
    (e) =>
      e.text.toLowerCase().includes(filter.toLowerCase()) ||
      e.date.includes(filter)
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Entries List</h2>
      <input
        type="text"
        placeholder="Filter by text or date..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 rounded w-full max-w-md"
      />
      {message && <div className="mb-2 text-red-600">{message}</div>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-max bg-white border rounded">
          <thead>
            <tr>
              <th
                style={{ width: colWidths.date }}
                className="border-b px-2 py-2 text-left relative"
              >
                Date
                <span
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => handleMouseDown("date", e)}
                ></span>
              </th>
              <th
                style={{ width: colWidths.text }}
                className="border-b px-2 py-2 text-left relative"
              >
                Entry
                <span
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => handleMouseDown("text", e)}
                ></span>
              </th>
              <th
                style={{ width: colWidths.actions }}
                className="border-b px-2 py-2 text-left relative"
              >
                Actions
                <span
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize"
                  onMouseDown={(e) => handleMouseDown("actions", e)}
                ></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td
                  className="border-b px-2 py-2"
                  style={{ width: colWidths.date }}
                >
                  {e.date}
                </td>
                <td
                  className="border-b px-2 py-2"
                  style={{ width: colWidths.text }}
                >
                  {e.text}
                </td>
                <td
                  className="border-b px-2 py-2"
                  style={{ width: colWidths.actions }}
                >
                  {editingId === e.entry_id ? (
                    <button
                      onClick={() => handleSave(e)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                      disabled={loading}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(e)}
                      className="p-1 rounded hover:bg-blue-100"
                      title="Edit"
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
                          d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h6a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
