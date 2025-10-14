# Portfolio Manager Workshop

Welcome to the Portfolio Manager Workshop! This hands-on workshop will guide you through using Gitpod to develop, modify, and deploy a full-stack web application.

## About the Application

Portfolio Manager is a finance/equity application that allows users to:
- Track stock portfolios with real-time values
- Record buy and sell transactions
- View portfolio performance metrics and gain/loss calculations
- Monitor transaction history

**Tech Stack:**
- **Frontend:** React with Vite (with graceful error handling)
- **Backend:** Node.js with Express (fails gracefully without DB)
- **Database:** PostgreSQL (via Dev Container feature)
- **Dev Environment:** Gitpod with Dev Containers and Ona Automations

---

## Exercise 1: Open and Explore the Development Environment

**Goal:** Learn how to open a Gitpod workspace, access it from different interfaces, and view the running application.

### Steps:

#### 1.1 Open the Workspace in Gitpod

1. Navigate to the repository: `https://github.com/meysholdt/ona-workshop`
2. Install the Gitpod browser extension if you haven't already:
   - Chrome/Edge: [Gitpod Extension](https://chrome.google.com/webstore/detail/gitpod/dodmmooeoklaejobgleioelladacbeki)
   - Firefox: [Gitpod Extension](https://addons.mozilla.org/en-US/firefox/addon/gitpod/)
3. Click the **Gitpod** button that appears on the repository page, or
4. Alternatively, prefix the repository URL with `gitpod.io/#` in your browser:
   ```
   https://gitpod.io/#https://github.com/meysholdt/ona-workshop
   ```
5. Wait for the workspace to initialize. This may take 2-3 minutes on first launch as it:
   - Builds the dev container
   - Installs Node.js dependencies via Ona automations
   - Starts PostgreSQL service via Ona automations
   - Initializes the database
   - Starts the backend API (port 3001) via Ona automations
   - Starts the frontend dev server (port 3000) via Ona automations

#### 1.2 Verify Services are Running

1. Once the workspace is ready, Ona automations will have started all services automatically
2. You can check the status of services using the Gitpod CLI:
   ```bash
   gitpod automations service logs database
   gitpod automations service logs backend
   gitpod automations service logs frontend
   ```
3. You may see port notifications in the bottom-right corner
4. To see all running automations:
   ```bash
   gitpod automations service list
   ```

#### 1.3 Open in VS Code Desktop

1. In the Gitpod workspace, press `F1` or `Ctrl+Shift+P` (Windows/Linux) / `Cmd+Shift+P` (Mac)
2. Type "Gitpod: Open in VS Code" and select it
3. If prompted, install the Gitpod extension for VS Code Desktop
4. VS Code Desktop will open with a remote connection to your Gitpod workspace
5. Open a terminal in VS Code Desktop: `Terminal > New Terminal`
6. Run a command to verify you're connected:
   ```bash
   pwd
   ```
   You should see: `/workspaces/workshop`

#### 1.4 Open in VS Code Web

1. In your browser, you should already be in the VS Code web interface (this is the default Gitpod view)
2. If you closed it, you can access it from your [Gitpod dashboard](https://gitpod.io/workspaces)
3. Open a terminal in VS Code Web: `Terminal > New Terminal` or press `` Ctrl+` ``
4. Run a command to verify the environment:
   ```bash
   node --version
   npm --version
   psql --version
   ```

#### 1.5 Open the Running Application

1. Look for the **Ports** panel in VS Code (usually at the bottom)
   - If not visible, go to `View > Ports` or press `Ctrl+Shift+P` and type "Ports: Focus on Ports View"
2. You should see three ports listed:
   - **3000** - Frontend (React app)
   - **3001** - Backend API
   - **5432** - PostgreSQL
3. Click the globe icon 🌐 next to port **3000** to open the frontend in a new browser tab
4. You should see the Portfolio Manager application with:
   - A purple gradient header
   - Portfolio summary cards showing Total Value, Total Cost, Gain/Loss, and Return
   - An empty holdings table (no stocks purchased yet)
   - A transaction form to buy/sell stocks
   - An empty transaction history

#### 1.6 Test the Application

1. In the application, use the transaction form to buy some stocks:
   - Select a stock (e.g., "AAPL - Apple Inc.")
   - Enter quantity (e.g., 10)
   - The price should auto-fill with the current price
   - Click **Buy Shares**
2. Observe the changes:
   - The holdings table now shows your purchase
   - Portfolio summary updates with new values
   - Transaction appears in the history section
3. Try buying more stocks or selling some shares

**✅ Exercise 1 Complete!** You've successfully opened a Gitpod workspace, accessed it from multiple interfaces, and interacted with the running application.

---

## Exercise 2: Make Code Changes and See Live Updates

**Goal:** Modify the application code and observe hot-reload functionality in the running application.

### Steps:

#### 2.1 Modify the Frontend Styling

1. In VS Code (web or desktop), open the file explorer
2. Navigate to `frontend/src/index.css`
3. Find the `header` style block (around line 18):
   ```css
   header {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     color: white;
     padding: 30px;
     border-radius: 10px;
     margin-bottom: 30px;
     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   }
   ```
4. Change the gradient colors to create a different look:
   ```css
   header {
     background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
     color: white;
     padding: 30px;
     border-radius: 10px;
     margin-bottom: 30px;
     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
   }
   ```
5. Save the file (`Ctrl+S` or `Cmd+S`)
6. Switch to your browser tab with the running application
7. **Observe:** The header gradient should change immediately without refreshing the page (hot module replacement)

#### 2.2 Modify the Application Title

1. Open `frontend/src/App.jsx`
2. Find the header section (around line 85):
   ```jsx
   <header>
     <h1>📊 Portfolio Manager</h1>
     <p>Track your equity investments and portfolio performance</p>
   </header>
   ```
3. Change the title and description:
   ```jsx
   <header>
     <h1>💼 My Investment Tracker</h1>
     <p>Monitor your stocks and maximize your returns</p>
   </header>
   ```
4. Save the file
5. **Observe:** The browser updates automatically with the new title

#### 2.3 Add a New Feature to the Backend

1. Open `backend/server.js`
2. Add a new API endpoint before the `app.listen()` call (around line 180):
   ```javascript
   // Get portfolio statistics
   app.get('/api/portfolios/:id/stats', async (req, res) => {
     try {
       const { id } = req.params;
       
       const result = await pool.query(`
         SELECT 
           COUNT(DISTINCT h.stock_id) as total_stocks,
           SUM(h.quantity) as total_shares,
           COUNT(t.id) as total_transactions
         FROM holdings h
         LEFT JOIN transactions t ON t.portfolio_id = h.portfolio_id
         WHERE h.portfolio_id = $1 AND h.quantity > 0
         GROUP BY h.portfolio_id
       `, [id]);
       
       res.json(result.rows[0] || { total_stocks: 0, total_shares: 0, total_transactions: 0 });
     } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'Failed to fetch statistics' });
     }
   });
   ```
3. Save the file
4. The backend server will automatically restart (using nodemon)
5. Test the new endpoint in a terminal:
   ```bash
   curl http://localhost:3001/api/portfolios/1/stats
   ```
6. You should see JSON output with portfolio statistics

#### 2.4 Verify Changes Persist

1. Make a few more transactions in the application
2. Refresh the browser page
3. **Observe:** All your data persists because it's stored in PostgreSQL
4. Check the backend logs:
   ```bash
   tail -f /tmp/backend.log
   ```
5. You should see API requests being logged

**✅ Exercise 2 Complete!** You've successfully modified both frontend and backend code and observed live updates.

---

## Exercise 3: Connect via SSH CLI

**Goal:** Learn how to connect to your Gitpod workspace using SSH from your local terminal.

### Steps:

#### 3.1 Install Gitpod CLI Locally (if not already installed)

1. Open a terminal on your **local machine** (not in Gitpod)
2. Install the Gitpod CLI:
   
   **macOS/Linux:**
   ```bash
   curl -fsSL https://gitpod.io/install.sh | sh
   ```
   
   **Windows (PowerShell):**
   ```powershell
   iwr https://gitpod.io/install.ps1 -useb | iex
   ```

3. Verify installation:
   ```bash
   gitpod version
   ```

#### 3.2 Authenticate with Gitpod

1. In your local terminal, run:
   ```bash
   gitpod login
   ```
2. This will open a browser window for authentication
3. Log in with your Gitpod account
4. Return to your terminal once authentication is complete

#### 3.3 List Your Workspaces

1. View all your running workspaces:
   ```bash
   gitpod environment list
   ```
2. Find your `workshop` workspace in the list
3. Note the workspace ID (it will look like: `username-onworkshop-xxxxx`)

#### 3.4 Connect via SSH

1. Connect to your workspace using SSH:
   ```bash
   gitpod environment ssh <workspace-id>
   ```
   Replace `<workspace-id>` with your actual workspace ID from the previous step

2. Alternatively, if you only have one workspace running:
   ```bash
   gitpod environment ssh
   ```

3. You should now be connected to your Gitpod workspace via SSH

#### 3.5 Explore the Environment via SSH

1. Check your current directory:
   ```bash
   pwd
   ```
   Output: `/workspaces/workshop`

2. List running processes:
   ```bash
   ps aux | grep node
   ```
   You should see the backend and frontend Node.js processes

3. Check PostgreSQL status:
   ```bash
   sudo service postgresql status
   ```

4. Query the database:
   ```bash
   psql -U portfolio_user -d portfolio_db -c "SELECT * FROM portfolios;"
   ```

5. View backend logs:
   ```bash
   tail -20 /tmp/backend.log
   ```

6. Check port forwarding:
   ```bash
   curl http://localhost:3001/api/health
   ```
   You should see: `{"status":"ok","message":"Portfolio Manager API is running"}`

#### 3.6 Make Changes via SSH

1. Edit a file using a terminal editor:
   ```bash
   nano backend/server.js
   ```
   Or use vim:
   ```bash
   vim backend/server.js
   ```

2. Add a console log to the health check endpoint:
   ```javascript
   app.get('/api/health', (req, res) => {
     console.log('Health check requested via SSH edit!');
     res.json({ status: 'ok', message: 'Portfolio Manager API is running' });
   });
   ```

3. Save and exit (Ctrl+X, then Y, then Enter for nano)

4. The backend will auto-restart. Test it:
   ```bash
   curl http://localhost:3001/api/health
   tail -5 /tmp/backend.log
   ```
   You should see your new log message

5. Exit the SSH session:
   ```bash
   exit
   ```

**✅ Exercise 3 Complete!** You've successfully connected to your Gitpod workspace via SSH and made changes from the command line.

---

## Exercise 4: Customize the Dev Container

**Goal:** Modify the dev container configuration to add new features, tools, and VS Code extensions, then rebuild the container.

### Steps:

#### 4.1 Add a Dev Container Feature

1. In VS Code, open `.devcontainer/devcontainer.json`
2. Find the commented-out `features` section
3. Uncomment and add the Docker-in-Docker feature:
   ```json
   {
     "name": "Portfolio Manager Workshop",
     "build": {
       "context": ".",
       "dockerfile": "Dockerfile"
     },
     "features": {
       "ghcr.io/devcontainers/features/docker-in-docker:2": {
         "moby": true,
         "dockerDashComposeVersion": "v2"
       }
     },
     "customizations": {
       "vscode": {
         "extensions": [
           "dbaeumer.vscode-eslint",
           "esbenp.prettier-vscode"
         ]
       }
     },
     "forwardPorts": [3000, 3001, 5432],
     "portsAttributes": {
       "3000": {
         "label": "Frontend",
         "onAutoForward": "notify"
       },
       "3001": {
         "label": "Backend API",
         "onAutoForward": "notify"
       },
       "5432": {
         "label": "PostgreSQL",
         "onAutoForward": "ignore"
       }
     },
     "postCreateCommand": "npm install --prefix backend && npm install --prefix frontend",
     "postStartCommand": "bash .devcontainer/start-services.sh"
   }
   ```
4. Save the file

#### 4.2 Add a VS Code Extension

1. In the same `devcontainer.json` file, add more extensions to the `extensions` array:
   ```json
   "customizations": {
     "vscode": {
       "extensions": [
         "dbaeumer.vscode-eslint",
         "esbenp.prettier-vscode",
         "ms-azuretools.vscode-docker",
         "eamodio.gitlens",
         "bradlc.vscode-tailwindcss"
       ]
     }
   }
   ```
2. Save the file

#### 4.3 Add a Tool to the Dockerfile

1. Open `.devcontainer/Dockerfile`
2. We'll add `bat` (a better cat command) by downloading from GitHub
3. Add this tool installation to the Dockerfile:
   ```dockerfile
   FROM gitpod/workspace-full

   # Node.js and common tools are already included in the base image

   # Install additional tools
   RUN sudo apt-get update && export DEBIAN_FRONTEND=noninteractive \
       && sudo apt-get -y install --no-install-recommends \
           jq \
           htop \
       && sudo apt-get clean -y \
       && sudo rm -rf /var/lib/apt/lists/*

   # Download and install a tool from GitHub (example: lazydocker)
   RUN curl -fsSL https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash

   # Download and install bat from GitHub
   RUN wget https://github.com/sharkdp/bat/releases/download/v0.24.0/bat_0.24.0_amd64.deb \
       && sudo dpkg -i bat_0.24.0_amd64.deb \
       && rm bat_0.24.0_amd64.deb
   ```
4. Save the file

#### 4.4 Validate the Dev Container Configuration

1. Open a terminal in VS Code
2. Run the validation command:
   ```bash
   gitpod environment devcontainer validate
   ```
3. You should see output indicating whether the configuration is valid
4. Fix any errors if they appear

#### 4.5 Rebuild the Dev Container

1. In the terminal, run:
   ```bash
   gitpod environment devcontainer rebuild
   ```
2. This will:
   - Stop the current workspace
   - Rebuild the Docker image with your changes
   - Start a new container
   - Reinstall dependencies
   - Restart all services
3. **Note:** This process takes 3-5 minutes
4. Your workspace will reload automatically when complete

#### 4.6 Verify the Changes

1. Once the workspace reloads, open a new terminal
2. Verify the new tools are installed:
   ```bash
   jq --version
   htop --version
   lazydocker --version
   bat --version
   ```

3. Test `jq` with the API:
   ```bash
   curl -s http://localhost:3001/api/health | jq '.'
   ```
   You should see the health check response formatted nicely

4. Test `bat` to view files with syntax highlighting:
   ```bash
   bat backend/server.js
   ```

5. Check that new VS Code extensions are installed:
   - Press `Ctrl+Shift+X` to open Extensions view
   - Search for "Docker" - you should see it installed
   - Search for "GitLens" - you should see it installed

#### 4.7 Use the New Tools

1. Run `htop` to see system processes:
   ```bash
   htop
   ```
   Press `q` to quit

2. Use `lazydocker` to manage Docker:
   ```bash
   lazydocker
   ```
   Press `q` to quit

3. Use `jq` to format API responses:
   ```bash
   curl -s http://localhost:3001/api/stocks | jq '.[0]'
   ```

**✅ Exercise 4 Complete!** You've successfully customized the dev container by adding features, tools, and extensions, then rebuilt the environment.

---

## Bonus Exercises

### Bonus 1: Add a New Stock

1. Connect to PostgreSQL:
   ```bash
   psql -U portfolio_user -d portfolio_db
   ```

2. Insert a new stock:
   ```sql
   INSERT INTO stocks (symbol, name, current_price)
   VALUES ('NVDA', 'NVIDIA Corporation', 495.50);
   ```

3. Exit psql:
   ```sql
   \q
   ```

4. Refresh the application and see the new stock in the dropdown

### Bonus 2: Create a New Portfolio

1. Add a new portfolio via SQL:
   ```bash
   psql -U portfolio_user -d portfolio_db -c "INSERT INTO portfolios (name, description) VALUES ('Tech Portfolio', 'Technology stocks only') RETURNING id;"
   ```

2. Modify the frontend to support multiple portfolios (advanced)

### Bonus 3: Add Real-Time Stock Prices

1. Modify `backend/server.js` to add a random price fluctuation endpoint
2. Create a frontend component that polls this endpoint every 5 seconds
3. Update the UI to show price changes with up/down indicators

### Bonus 4: Export Portfolio Data

1. Add a new API endpoint to export portfolio data as CSV
2. Add a "Download Report" button to the frontend
3. Test the export functionality

### Bonus 5: Test Graceful Failure Handling

1. Stop the database service to see how the app handles it:
   ```bash
   gitpod automations service stop database
   ```

2. Refresh the application in your browser
3. You should see a nice error banner explaining the database is unavailable
4. The app still renders normally with a helpful message and retry button

5. Restart the database:
   ```bash
   gitpod automations service start database
   ```

6. Click the "Retry Connection" button in the app
7. The app should reconnect and load data successfully

### Bonus 6: Explore Ona Automations

1. View the automations configuration:
   ```bash
   cat .ona/automations.yaml
   ```
2. Add a new task to run tests:
   ```bash
   cat <<EOF | gitpod automations update -
   tasks:
     test:
       name: Run Tests
       description: Run all tests
       command: echo "Running tests..." && sleep 2 && echo "Tests passed!"
   EOF
   ```
3. Run the task:
   ```bash
   gitpod automations task start test
   ```
4. View task execution history:
   ```bash
   gitpod automations task list-executions test
   ```

---

## Troubleshooting

### Services Not Starting

If services don't start automatically, you can manually start them using Ona automations:

```bash
# Check automation status
gitpod automations service list

# Start individual services
gitpod automations service start database
gitpod automations service start backend
gitpod automations service start frontend

# View service logs
gitpod automations service logs database
gitpod automations service logs backend
gitpod automations service logs frontend
```

### Database Connection Issues

Reset the database:

```bash
sudo -u postgres psql -c "DROP DATABASE portfolio_db;"
sudo -u postgres psql -c "CREATE DATABASE portfolio_db;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"
cd /workspaces/workshop/backend
node init-db.js
```

### Port Already in Use

Kill processes on ports:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Dev Container Rebuild Fails

1. Check the validation output for errors
2. Ensure JSON syntax is correct in `devcontainer.json`
3. Check Dockerfile syntax
4. View build logs for specific error messages

---

## Summary

Congratulations! You've completed the Portfolio Manager Workshop. You've learned how to:

✅ Open and navigate a Gitpod workspace  
✅ Access the workspace from VS Code Desktop, VS Code Web, and SSH  
✅ Make live code changes with hot-reload  
✅ Connect via SSH CLI for remote development  
✅ Customize dev containers with features, tools, and extensions  
✅ Rebuild dev containers to apply changes  

### Next Steps

- Explore the [Gitpod Documentation](https://www.gitpod.io/docs)
- Learn about [Dev Container Features](https://containers.dev/features)
- Try building your own application with Gitpod
- Share your workspace with team members for collaboration

---

## Resources

- **Gitpod Docs:** https://www.gitpod.io/docs
- **Dev Containers Spec:** https://containers.dev/
- **React Documentation:** https://react.dev/
- **Express.js Guide:** https://expressjs.com/
- **PostgreSQL Tutorial:** https://www.postgresql.org/docs/

Happy coding! 🚀
