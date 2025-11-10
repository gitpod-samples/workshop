# Portfolio Manager Workshop

Welcome to the Portfolio Manager Workshop! This hands-on workshop will guide you through using Ona to develop, modify, and deploy a full-stack web application.

## About the Application

Portfolio Manager is a finance/equity application that allows users to:
- Track stock portfolios with real-time values
- Record buy and sell transactions
- View portfolio performance metrics and gain/loss calculations
- Monitor transaction history

**Tech Stack:**
- **Frontend:** React with Vite
- **Backend:** Node.js with Express
- **Database:** JSON

---

## Prerequisite: Setup

1. If you use VS Code Desktop, please updeate VS Code to the latest version. 
Also ensure that the following extensions are upgraded to the latest versions: 
   - [Microsoft: Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)
   - [Ona.com](https://marketplace.visualstudio.com/items?itemName=gitpod.gitpod-flex)
2. Optional but recommended: Install [Ona Brwoser extension](https://ona.com/docs/ona/integrations/browser-extension#browser-extension) for easier opening git repositories directly from GitHub, GitLab and BitBucket.

## Exercise 1: Open and Explore the Development Environment

**Goal:** Learn how to open an Ona dev env and access it from different interfaces.

### Steps:

#### 1.1 Open the Environment in Ona

1. Open an environment for the `https://github.com/gitpod-samples/workshop` repo by: Navigating to `projects` in the nav bar, then opening an environment for the `ona workshop` project. If there is no project, feel free to create a project under `/projects`, or proceed without a project my clicking in "new Environment" -> "from URL" and pasting the repos' URL.
2. Wait for the environment to initialize. This may take 2-3 minutes on first launch as it:
   - Builds the dev container
   - Installs Node.js dependencies via Ona automations
   - Initializes the SQLite database
   - Starts the backend API (port 3001) via Ona automations

#### 1.2 Open in VS Code Web

1. In the Ona dev env open the "Environment" tab
2. On the top-right, click on the triangle to get a dropdown of available IDEs and select "VS Code Browser"
3. VS Code will open in your browser with a remote connection to your Ona Environment
4. Open a terminal in VS Code: `Terminal > New Terminal`
5. Run a command to verify you're connected:
   ```bash
   uname -a
   ```
   It will show the name of the operating system running in your dev env.

#### 1.3 Open in VS Code Desktop

1. In the Ona dev env open the "Environment" tab
2. On the top-right, click on the triangle to get a dropdown of available IDEs and select "VS Code Desktop"
3. If prompted, install the Ona extension for VS Code Desktop
4. VS Code Desktop will open with a remote connection to your Ona Environment
5. Open a terminal in VS Code Desktop: `Terminal > New Terminal`
6. Run a command to verify you're connected:
   ```bash
   uname -a
   ```
   It will show the name of the operating system running in your dev env.

#### 1.4 Verify the Backend Service

1. Look for the **Ports** panel in VS Code (usually at the bottom)
   - If not visible, go to `View > Ports` or press `Ctrl+Shift+P` and type "Ports: Focus on Ports View"
2. You should see one port listed:
   - **3001** - Backend API
3. The backend API is running via Ona automations that started automatically when the environment launched

**✅ Exercise 1 Complete!** You've successfully opened an Ona workspace and accessed it from multiple interfaces.

---

## Exercise 2: Introduction to Automations

**Goal:** Learn how to work with Ona automations by enabling the frontend service, loading it into the management plane, and running the application.

### Steps:

#### 2.1 Understand Automations

Ona automations allow you to define services and tasks that run automatically in your development environment. The configuration is stored in `.ona/automations.yaml`.

Currently, only the backend service is running. The frontend service is commented out. Let's enable it!

#### 2.2 Uncomment the Frontend Service

1. Open `.ona/automations.yaml`
2. Find the commented-out `frontend` service (lines 26-54)
3. Uncomment the entire frontend service section by removing the `#` symbols
4. Save the file

**Tip:** Make sure to uncomment all lines including the service name, description, triggeredBy, commands (start, ready, stop), and their content.

#### 2.3 Load the Automation into the Management Plane

After modifying the automations file, you need to reload it:

1. Open a terminal in VS Code
2. Run the update command:
   ```bash
   gitpod automations update
   ```
3. This will validate and load your updated automation configuration
4. You should see output confirming the configuration was updated successfully

#### 2.4 Start the Frontend Service

Now that the automation is loaded, start the frontend service:

1. In the terminal, run:
   ```bash
   gitpod automations service start frontend
   ```
2. This will:
   - Wait for dependencies to be installed
   - Expose port 3000 publicly
   - Start the React + Vite development server
3. Wait for the service to start (this may take 30-60 seconds)

#### 2.5 Open the Application

1. Look for the **Ports** panel in VS Code (usually at the bottom)
2. You should now see two ports listed:
   - **3000** - Frontend (React app)
   - **3001** - Backend API
3. Click the globe icon 🌐 next to port **3000** to open the frontend in a new browser tab
4. You should see the Portfolio Manager application with:
   - A purple gradient header
   - Portfolio summary cards showing Total Value, Total Cost, Gain/Loss, and Return
   - An empty holdings table (no stocks purchased yet)
   - A transaction form to buy/sell stocks
   - An empty transaction history

#### 2.6 Explore Automation Commands

Try these commands to manage your services:

```bash
# View all services and their status
gitpod automations service list

# View frontend service logs
gitpod automations service logs frontend

# Stop the frontend service
gitpod automations service stop frontend

# Start it again
gitpod automations service start frontend
```

**✅ Exercise 2 Complete!** You've successfully worked with Ona automations to enable, load, and run the frontend service.

---

## Exercise 3: Customize the Dev Container

**Goal:** Modify the dev container configuration to add new tools, then rebuild the container.

### Steps:

#### 3.1 Add a Tool to the Dockerfile

1. Open `.devcontainer/Dockerfile`
2. Find the commented-out RUN section that installs the "gh" command
3. Uncomment the section so the "gh" binary will be installed
4. Save the file

#### 3.2 Validate the Dev Container Configuration

1. Open a terminal in VS Code
2. Run the validation command:
   ```bash
   gitpod environment devcontainer validate
   ```
3. You should see output indicating whether the configuration is valid
4. Fix any errors if they appear

#### 3.3 Rebuild the Dev Container

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

#### 3.4 Verify the Changes

1. Once the workspace reloads, open a new terminal
2. Verify the new tool is installed:
   ```bash
   gh --version
   ```
3. If you had the frontend service running from Exercise 2, verify it's still working by opening port 3000 via the VS Code "Ports" panel

**✅ Exercise 3 Complete!** You've successfully customized the dev container by adding tools and then rebuilt the environment.

---

### Next Steps

- Explore the [Ona Documentation](https://ona.com/docs)
- Learn about [Dev Container Features](https://containers.dev/features)
- Try building your own application with Ona

---

Happy coding! 🚀
