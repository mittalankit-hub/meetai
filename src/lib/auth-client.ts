import { createAuthClient } from "better-auth/react"

// const getBaseURL = () => {
//   if (typeof window !== "undefined") {
//     // In the browser – use relative URLs so it works for both localhost and Codespaces
//     return "https://ubiquitous-space-yodel-jjqxj46wx46w2ww4-3000.app.github.dev/";
//   } else {
//     // On the server (e.g. during SSR), fallback to localhost
//     return "http://localhost:3000";
//   }
//   return "http://localhost:3000";
// };


export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
})