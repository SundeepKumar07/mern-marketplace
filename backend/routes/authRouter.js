import express from 'express';
import { deleteAccount, googleSignIn, signIn, signOut, signUp } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const authRouter = express.Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/google', googleSignIn);
authRouter.post('/sign-out',verifyToken, signOut);
authRouter.delete('/delete',verifyToken, deleteAccount);
// authRouter.delete('/delete-all', deleteAllAccount);

export default authRouter;