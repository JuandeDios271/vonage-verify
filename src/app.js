import express from 'express';
import { corsMiddleware, handleCorsError } from './middlewares/corsMiddlewares.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import verifyRoutes from './routes/verifyRoutes.js';

function startApp() {

    const app = express();

   /**
    * 🛡️ MIDDLEWARE ORDER (IMPORTANT):
    *
    * 1. CORS middleware must be initialized to allow the browser to evaluate
    *    whether it can send the request (preflight OPTIONS, Origin, etc.)
    *
    * 2. express.json() allows parsing the body of POST/PUT requests.
    *
    * 3. authMiddleware validates that basic credentials are correct.
    *    It must be initialized after CORS so that authorization headers arrive.
    *
    * 4. Routes are set up once the middleware has passed.
    *
    * 5. The handleCorsError middleware is responsible for catching errors
    *    related to disallowed origins and returning a friendly response.
    */

    // Global Middlewares

    // 1. Allow requests from defined origins (with credentials)
    app.use( corsMiddleware );

    // 2. Parse JSON from the body (required for modern REST APIs)
    app.use( express.json() ); 

    // 3. Validate basic authentication (protect all routes)
    app.use( authMiddleware );

    // 4. Mount protected routes under /api/verify prefix
    app.use( '/api/verify', verifyRoutes );

    // 5. Handling CORS-related errors (optional but useful)
    app.use( handleCorsError );

    // Port definition
    const port = process.env.PORT || 3000;

    // Server launch
    app.listen( port, () => {
        console.log(`Server running on port ${PORT}`);
    } );

}