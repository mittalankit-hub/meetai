import { createAuthClient } from "better-auth/react"



export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
})


// export const authClient = createAuthClient({
//     /** The base URL of the server (optional if you're using the same domain) */
//     baseURL: "https://ideal-dollop-97jp7qv4pjjrfxxw5-3000.app.github.dev/",
// })