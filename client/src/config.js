// Set VITE_API_URL in the production frontend environment to the deployed API URL.
// The local fallback keeps `npm run dev` working without extra configuration.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000")
  .replace(/\/$/, "")
