// routes/user.js or similar
import express from 'express';
import { getUser, getUserListing, updatePassword, updateProfilePhoto, updateUser, verifyPassword } from '../controllers/userController.js';
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();

router.post('/update-photo', verifyToken, updateProfilePhoto);
router.post('/verify-password', verifyToken, verifyPassword);
router.put('/update-password', verifyToken, updatePassword);
router.put('/update-user', verifyToken, updateUser);
router.get('/listings/:id', verifyToken, getUserListing);
router.get('/get/:id', getUser);
export default router;