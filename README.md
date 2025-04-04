# Credit Rating Project

## Description
This project is a full-stack application with a backend built using FastAPI and a frontend developed with React. The backend handles various services, including API endpoints for mortgage calculations, while the frontend allows users to interact with the system through a user-friendly interface.

---

## Project Structure

### Backend

1. **Install dependencies:**
   - Navigate to the `backend` directory and install the necessary Python packages.
   ```bash
   cd credit_rating/backend
   pip install -r requirements.txt
2. **Running the Backend: Start the backend server using Uvicorn:**
      ```bash
      python -m uvicorn backend.app:app --reload

3. **Running Tests: To run the tests, use the following command:**
   ```bash
   cd backend
   pytest tests/

4. **Frontend Install dependencies: Navigate to the frontend directory and install the required Node.js packages:**
   ```bash
      cd credit_rating/frontend
      npm install

5. **Running the Frontend: Start the frontend application:**
   ```bash
   npm start

Project Structure
Backend
backend/app.py: Main FastAPI application file.

backend/tests/: Folder containing unit and integration tests.

database/database/: Contains database connection and schema files.

Frontend
frontend/: Contains React app files and configurations.

Notes
Ensure that both the frontend and backend are running for the project to work properly.

Backend tests can be executed using the pytest command in the backend directory.

For development, both frontend and backend should be run in separate terminal windows.

License
This project is licensed under the MIT License - see the LICENSE file for details.


This `README.md` file includes both setup instructions for the backend and frontend, project structure, and basic commands needed to run the application.
