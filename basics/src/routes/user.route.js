import express from 'express';
import {validateUser} from './../middlewares/validateUser.middleware.js';
import {createUserSchema} from './../utils/validation.schema.js';
import { createUser } from '../controllers/user.controller.js';

const router = express.Router();
router.post('/', validateUser(createUserSchema), createUser);

export default router;