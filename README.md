# Automatic Weekly Update Generator – Frontend

This is the frontend for the **Automatic Weekly Update Generator**: a professional, full-stack application that helps users log daily work, receive reminders, and generate weekly summaries using Google Gemini LLM. The frontend is built with React (Vite), Tailwind CSS, and integrates with Supabase for authentication and backend API calls.

## Features

- **Magic Link Authentication** (Supabase)
- **Daily Entry Logging** (create, view, edit)
- **Weekly Report Generation** (with Gemini LLM)
- **View/Edit All Entries**
- **View All Weekly Reports** (filterable, resizable tables)
- **User Settings** (timezone, reminders, PDF/email options)
- **Responsive UI** (Tailwind CSS)
- **Professional UX** (modals, spinners, copy-to-clipboard, etc.)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Supabase project (for auth and database)
- Backend API (FastAPI, running separately)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd automatic_weekly_update/frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the root of `frontend/`:

   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_API_BASE_URL=http://localhost:8000  # or your FastAPI backend URL
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

## Project Structure

```
src/
  components/         # React components (EntriesList, WeeklyReportsList, etc.)
  App.js              # Main app component
  main.js             # Entry point
  ...
```

## Usage

1. **Login:**  
   Enter your email to receive a magic link (via Supabase). Click the link to authenticate.

2. **Daily Entry:**  
   Log your daily work. Edit previous entries as needed.

3. **Weekly Report:**  
   Select a week, generate a summary (via Gemini LLM), and view/download/copy the report.

4. **Settings:**  
   Configure your timezone, reminder preferences, and PDF/email options.

5. **View/Edit Entries & Reports:**  
   Use the tables to view, filter, and edit all your entries and weekly reports.

## Customization

- **Styling:**  
  Tailwind CSS is used for rapid, responsive UI development. Customize styles in `tailwind.config.js` or component classes.

- **API Integration:**  
  All API calls are made to the FastAPI backend. Update `VITE_API_BASE_URL` as needed.

- **Authentication:**  
  Supabase JS SDK handles magic link login and session management.

## Deployment

To build for production:

```bash
npm run build
# or
yarn build
```

Deploy the contents of the `dist/` folder to your preferred hosting provider (Vercel, Netlify, etc.).

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## License

[MIT](../LICENSE) (or your chosen license)

---

**Questions?**  
Open an issue or contact the maintainer.
