
import express from 'express';
import { getCurrentUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

//GET CURRENT USER
router.get("/currentUser",protect,getCurrentUser);

export default router;