# Portfolio Manager Workshop

Welcome to the Portfolio Manager Workshop! This hands-on workshop will guide you through using Gitpod to develop, modify, and deploy a full-stack web application.

## About the Application

Portfolio Manager is a finance/equity application that allows users to:
- Track stock portfolios with real-time values
- Record buy and sell transactions
- View portfolio performance metrics and gain/loss calculations
- Monitor transaction history

**Tech Stack:**
- **Frontend:** React with Vite
- **Backend:** Node.js with Express
- **Database:** PostgreSQL

---

## Exercise 1: Open and Explore the Development Environment

**Goal:** Learn how to open an Ona dev env, access it from different interfaces, and view the running application.

### Steps:

#### 1.1 Open the Environment in Ona

1. Navigate to the repository: `https://github.com/gitpod-samples/workshop`
2. Install the Gitpod browser extension if you haven't already:
   - Chrome/Edge: [Gitpod Extension](https://chrome.google.com/webstore/detail/gitpod/dodmmooeoklaejobgleioelladacbeki)
   - Firefox: [Gitpod Extension](https://addons.mozilla.org/en-US/firefox/addon/gitpod/)
3. Click the **Open** button that appears on the repository page, or
4. Alternatively, prefix the repository URL with `app.gitpod.io/#` in your browser:
   ```
   https://app.gitpod.io/#https://github.com/gitpod-samples/workshop
   ```
5. Wait for the environment to initialize. This may take 2-3 minutes on first launch as it:
   - Builds the dev container
   - Installs Node.js dependencies via Ona automations
   - Starts PostgreSQL service via Ona automations
   - Initializes the database
   - Starts the backend API (port 3001) via Ona automations
   - Starts the frontend dev server (port 3000) via Ona automations

#### 1.2 Open in VS Code Web

1. In the Ona dev env open the "Environment" tab
2. On the top-right, click on the triangle to get a dropdown of available IDEs and select "VS Code Browser"
5. Open a terminal in VS Code Desktop: `Terminal > New Terminal`
6. Run a command to verify you're connected:
   ```bash
   uname -a
   ```
   It will show the name of the operating system running in your dev env.

#### 1.3 Open in VS Code Desktop

1. In the Ona dev env open the "Environment" tab
2. On the top-right, click on the triangle to get a dropdown of available IDEs and select "VS Code Desktop"
3. If prompted, install the Ona extension for VS Code Desktop
4. VS Code Desktop will open with a remote connection to your One Environment
1. Look for the **Ports** panel in VS Code (usually at the bottom)
   - If not visible, go to `View > Ports` or press `Ctrl+Shift+P` and type "Ports: Focus on Ports View"
2. You should see three ports listed:
   - **3000** - Frontend (React app)
   - **3001** - Backend API
   - **5432** - PostgreSQL
3. Click the globe icon 🌐 next to port **3000** to open the frontend in a new browser tab
4. You should see the Portfolio Manager application with:
   - an error message that no Postgres is available
   - A purple gradient header
   - Portfolio summary cards showing Total Value, Total Cost, Gain/Loss, and Return
   - An empty holdings table (no stocks purchased yet)
   - A transaction form to buy/sell stocks
   - An empty transaction history

**✅ Exercise 1 Complete!** You've successfully opened an Ona workspace, accessed it from multiple interfaces, and interacted with the running application.

---

## Exercise 2: Customize the Dev Container

**Goal:** Modify the dev container configuration to add new features, tools, and VS Code extensions, then rebuild the container.

### Steps:

#### 2.1 Add a Dev Container Feature

1. In VS Code, open `.devcontainer/devcontainer.json`
2. Find the commented-out `features` section
3. Uncomment the section so the "postgres" feature become active.
4. Save the file

#### 2.2 Add a Tool to the Dockerfile

1. Open `.devcontainer/Dockerfile`
2. Find the commented-out RUN section that insalls the "gh" command.
3. Uncomment the section so the "gh" binary will be installed.
4. Save the file

#### 4.3 Validate the Dev Container Configuration

1. Open a terminal in VS Code
2. Run the validation command:
   ```bash
   gitpod environment devcontainer validate
   ```
3. You should see output indicating whether the configuration is valid
4. Fix any errors if they appear

#### 4.4 Rebuild the Dev Container

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
3. **Note:** This process takes 3-5 minutes. 
4. **Note:** Your IDE may temporarily disconnect during this process. 
5. Your workspace will reload automatically when complete

#### 4.6 Verify the Changes

1. Once the workspace reloads, open a new terminal
2. Verify the new tools are installed:
   ```bash
   gh --version
   ```
3. Open the application again via the VS Code "ports" tab. Now the "no postgres" error should be gone and the app should be fully functional. 

**✅ Exercise 4 Complete!** You've successfully customized the dev container by adding features and tools and then rebuilt the environment.

---

### Next Steps

- Explore the [Ona Documentation](https://ona.com/docs)
- Learn about [Dev Container Features](https://containers.dev/features)
- Try building your own application with Ona

---

Happy coding! 🚀
