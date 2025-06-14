import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./components/Login";
import DailyEntry from "./components/DailyEntry";
import Settings from "./components/Settings";
import WeeklyReport from "./components/WeeklyReport";
import EntriesList from "./components/EntriesList";
import WeeklyReportsList from "./components/WeeklyReportsList";

const backendUrl = "http://localhost:8000";

function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("DailyEntry");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white shadow flex justify-center space-x-4 py-4 mb-8">
        <button
          onClick={() => setPage("DailyEntry")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            page === "DailyEntry"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-100"
          }`}
        >
          Daily Entry
        </button>
        <button
          onClick={() => setPage("Settings")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            page === "Settings"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-100"
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setPage("WeeklyReport")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            page === "WeeklyReport"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-100"
          }`}
        >
          Weekly Report
        </button>
        <button
          onClick={() => setPage("EntriesList")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            page === "EntriesList"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-100"
          }`}
        >
          All Data
        </button>
        <button
          onClick={() => setPage("WeeklyReportsList")}
          className={`px-4 py-2 rounded font-semibold transition-colors ${
            page === "WeeklyReportsList"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-blue-100"
          }`}
        >
          ALL Weekly Reports
        </button>
        <button
          onClick={() => {
            supabase.auth.signOut();
            setSession(null);
          }}
          className="px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </nav>
      {page === "DailyEntry" && (
        <DailyEntry session={session} backendUrl={backendUrl} />
      )}
      {page === "Settings" && (
        <Settings session={session} backendUrl={backendUrl} />
      )}
      {page === "WeeklyReport" && (
        <WeeklyReport session={session} backendUrl={backendUrl} />
      )}
      {page === "EntriesList" && (
        <EntriesList session={session} backendUrl={backendUrl} />
      )}
      {page === "WeeklyReportsList" && (
        <WeeklyReportsList session={session} backendUrl={backendUrl} />
      )}
    </div>
  );
}

export default App;
