import express from 'express';
import { login, logout, register } from '../controllers/auth.controller.js';


const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

//LOGOUT
router.get('/logout', logout);



export default router;