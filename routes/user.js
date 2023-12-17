import express from "express";
import { allUsers,login,logout} from "../controllers/user.js";
 
const router = express.Router();

router.get("/allusers",allUsers)
router.post("/login",login)
router.post("/logout",logout)

export default router;