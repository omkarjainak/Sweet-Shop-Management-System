1. Install dependencies

Make sure you’re in your frontend project directory (e.g., sweet-shop-management/frontend) and run:
            
            npm install


This will install all required packages from package.json.

2. Start the development server

After installation:
                   
            npm run dev


3. Make sure the backend is running

Your frontend calls API endpoints like:

http://localhost:5000/api/sweets
http://localhost:5000/api/auth/login


So you must start your backend server on port 5000 first.

4. Common issues

CORS errors → Make sure backend allows requests from localhost:5173 or localhost:3000.

Module not found → Run npm install again.

Port conflicts → If Vite or CRA says port is busy, choose another or kill existing process:

lsof -i :5173   # list process using port
kill -9 <pid>   # kill it


If you want, I can give you a single command workflow to run both frontend and backend together for development. It saves time. Do you want me to do that?