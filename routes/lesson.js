import express from "express";
import { addLesson,myLessons,deleteLesson} from "../controllers/lesson.js";

const router = express.Router();

router.post("/addLesson/:kullaniciAdi", addLesson);
router.get("/myLessons/:kullaniciAdi", myLessons);
router.delete("/deleteLesson",deleteLesson);

export default router;