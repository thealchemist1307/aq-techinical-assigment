# Full Stack Chatbot Application

This project is a full-stack web application featuring a Django backend (with Django Channels for real-time WebSocket communication) and a React frontend bootstrapped with Vite, styled with Tailwind CSS and Ant Design. The application provides user authentication via JWT tokens and includes a chatbot component that echoes user input in real time.

> **Setup and Run Scripts:**  
> From the project root, run the `setup_script.bat` script to install all dependencies for both the backend and frontend. Once setup is complete, run the `run_script.bat` script to open separate terminals for the backend and frontend servers.  
>
> **If the scripts fail,** please ensure:
> - Python 3 is installed and available in your PATH.
> - Node.js and npm are installed.
> - Your internet connection is active.
> - You have the necessary permissions to execute batch files.

## Table of Contents

- [Setup](#setup)
  - [Using the Setup Script](#using-the-setup-script)
- [Running the Application](#running-the-application)
  - [Using the Run Script](#using-the-run-script)
  - [Manual Commands](#manual-commands)
- [Usage](#usage)
  - [Login](#login)
  - [Chatbot](#chatbot)
- [Special Configurations](#special-configurations)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Setup

### Using the Setup Script

A Windows batch script (`setup_script.bat`) is provided in the project root. This script will:

1. Change into the `backend` folder.
2. Check if Python 3 is installed.
3. Check for a virtual environment named `venv`. If it doesn't exist, the script will create one.
4. Activate the virtual environment and run `pip install -r requirements.txt` to install backend dependencies.
5. Change into the `frontend` folder and run `npm install --force` to install frontend dependencies.

To run the setup script:

1. Open a Command Prompt in the project root.
2. Execute:
   ```batch
   setup_script.bat
3.  If any step fails, refer to the Troubleshooting section below.

Running the Application
-----------------------

### Using the Run Script

A Windows batch script (`run_script.bat`) is provided that:

*   Opens a new terminal for the backend server (activating the virtual environment before starting Django/Channels).
*   Opens another terminal for the frontend server (running `npm run dev`).
*   Closes the parent terminal once both windows have been launched.

To run the application:

1.  In the project root, execute:
    
    ```batch
    run_script.bat
    ```
    
2.  Two separate Command Prompt windows will open—one for the backend and one for the frontend.

### Manual Commands

#### Backend

1.  Open a Command Prompt and navigate to the `backend` folder.
2.  Activate your virtual environment:
    *   **Windows:**
        
        ```batch
        venv\Scripts\activate
        ```
        
3.  Start the Django server (with Channels support using Daphne):
    
    ```batch
    daphne -b 127.0.0.1 -p 8000 core.asgi:application
    ```
    

#### Frontend

1.  Open a separate Command Prompt and navigate to the `frontend` folder.
2.  Start the Vite development server:
    
    ```batch
    npm run dev
    ```
    

Usage
-----
### Register

1.  **Access the Register Page:**  
    Open your browser and navigate to `http://localhost:5173/register` .
2.  **Create an Account:**  
    Fill in the required details (username, email, password, etc.) on the Register page to create a new account. Upon successful registration, you'll be prompted to log in.

### Login

1.  **Access the Login Page:**  
    Open your browser and navigate to `http://localhost:5173/login` .
2.  **Log In:**  
    Enter your username and password. On successful login, JWT tokens are stored in `localStorage` and you'll be redirected to the dashboard.

### Chatbot

1.  **Dashboard Access:**  
    Once logged in, the dashboard displays filler content along with a floating chatbot widget.
2.  **Chat Interaction:**  
    Click the chatbot widget (usually at the bottom-right corner) to open the chat window.
    *   **Sending a Message:**  
        Type your message in the text area and press Enter or click the Send button.
    *   **Real-Time Response:**  
        The chatbot echoes your message in real time via WebSocket communication.

Special Configurations
----------------------

*   **JWT Authentication:**  
    The backend uses JWT-based authentication. Ensure your frontend handles tokens properly.
*   **Django Channels:**  
    The application leverages Django Channels for real-time features. Verify your ASGI configuration in `core/asgi.py` and ensure you're using an ASGI server like Daphne.
*   **Ant Design & Tailwind CSS:**  
    The frontend uses Ant Design components styled with Tailwind CSS. Some components may require custom wrappers for complete customization.
*   **Pre-Build Tests:**  
    All unit tests should pass before creating a new build. You can enforce this via prebuild scripts in your `package.json`.

Troubleshooting
---------------

*   **Setup Script Failures:**
    *   Ensure Python 3 and Node.js are installed and available in your system PATH.
    *   Verify your internet connection and file permissions for executing batch scripts.
*   **Application Issues:**
    *   If the backend or frontend fails to start, try running the commands manually as described above.
    *   For Django Channels issues, confirm your ASGI configuration and ensure you're using Daphne (or another ASGI server).
*   **Test Failures:**  
    Run:
    
    ```bash
    backend/python manage.py test #for Django
    frontend/npm run test #for React
    ```
    
    Ensure to run backend tests and  frontend tests before building.

License
-------

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
