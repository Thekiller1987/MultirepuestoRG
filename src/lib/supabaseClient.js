import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://scrwnsgkxxkogdntgggz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjcnduc2dreHhrb2dkbnRnZ2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDIwNTYsImV4cCI6MjA3NDMxODA1Nn0.RI4XRSflR3SqAu8R2Sxtn8i7ZBKSl1Db9tMqovTzaFI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);