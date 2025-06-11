import { setupServer } from "./server.js";

async function startApp() {
    await setupServer(); 
}

startApp();