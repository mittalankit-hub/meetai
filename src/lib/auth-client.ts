import { polarClient } from "@polar-sh/better-auth"
import { createAuthClient } from "better-auth/react"



export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins:[polarClient()]
})


// export const authClient = createAuthClient({
//     /** The base URL of the server (optional if you're using the same domain) */
//     baseURL: "https://orange-space-waffle-v6qx6g47xq6rc6w4r-3000.app.github.dev/",
//     plugins:[polarClient()]

// })