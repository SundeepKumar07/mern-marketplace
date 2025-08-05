import express from 'express';
import { createList, deleteList, editList, getListings, getOneList } from '../controllers/listController.js';
import verifyToken from '../middleware/verifyToken.js';

const listRouter = express.Router();

listRouter.post('/create-listing',verifyToken, createList);
listRouter.delete('/delete-listing/:id',verifyToken, deleteList);
listRouter.put('/edit-listing/:id',verifyToken, editList);
listRouter.get('/get-listing/:id', getOneList);
listRouter.get('/get-listings', getListings);

export default listRouter;