import express from "express"
import { createCreditsOrder } from "../controllers/credits.controller.js"
import {protect} from "../middlewares/protect.js"

const router = express.Router()
router.post("/order" , protect ,createCreditsOrder )

export default router