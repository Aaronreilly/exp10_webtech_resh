# NodeServerApp – Ex. No. 10

## Run locally
1. Install Node.js from https://nodejs.org
2. Open this folder in Visual Studio Code
3. Open the terminal in this folder and run: `npm start`
4. Open http://localhost:3000 in a browser. The server also uses the `PORT` environment variable when provided.

## Expected terminal output
Server running at http://localhost:3000

## Dashboard features
- Click counter with a reset button
- Live clock and light/dark theme toggle
- Connection test backed by the `/health` endpoint
- Current request path and method

Keep the terminal running while you use the page. If the browser says `ERR_CONNECTION_REFUSED`, the server is stopped or the port is unavailable. Return to this folder's terminal, run `npm start`, and leave that terminal open. If port 3000 is already in use, set a different `PORT` before starting the server.

## Deploy to Vercel
1. Push this project to a GitHub repository.
2. In Vercel, select **Add New Project** and import that repository.
3. Keep the default project settings and deploy. Vercel serves the function in `api/index.js`; `vercel.json` sends incoming paths to it.
4. Open the deployment URL shown by Vercel.
