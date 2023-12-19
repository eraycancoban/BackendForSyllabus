import express from "express";
import { addProgram} from "../controllers/program.js";
 
const router = express.Router();

router.post("/addProgram/:kullaniciadi",addProgram)


export default router;