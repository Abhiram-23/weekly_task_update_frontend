import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xjipkrghzrmwqlgjeatv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXBrcmdoenJtd3FsZ2plYXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDAxNzYsImV4cCI6MjA2NTQxNjE3Nn0.h2_Z6JxBA1Vy8cKUBdqd8KDjbGadztWNK0GZJtKcUNI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
