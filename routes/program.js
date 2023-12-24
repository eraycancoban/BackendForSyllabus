import express from "express";
import { addProgram,getProgram} from "../controllers/program.js";
 
const router = express.Router();

router.post("/addProgram/:kullaniciadi",addProgram)
router.get("/getProgram",getProgram)

export default router;