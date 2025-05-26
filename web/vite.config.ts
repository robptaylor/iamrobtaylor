import { defineConfig, loadEnv } from "vite";
import plugins from "./Plugins";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: plugins(mode),
        server: {
            port: 3001, // To run the app on port 3000
            open: true, // If we want to open the app once its started,
            proxy: {
              '/api': { // The path that will be intercepted by the proxy
                target: 'http://localhost:3000', // Your backend server's URL (replace with your actual address)
                changeOrigin: true, // Modifies the Origin header to match the target URL
                secure: false,      // Allows proxying requests over HTTP (if your backend uses HTTP)
                // rewrite: (path) => path.replace(/^\/api/, '') // Optional: Rewrite the path (e.g., /api/users -> /users)
              }
            }
        },
        // Defining variables at global level
        define: {
            "process.env": {
                ENV_VARIABLE: env.VARIABLE
            },
            global: {},
            anotherVariable: {}
        },
    };
});