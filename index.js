import express from "express"
import cors from "cors"
import userRouter from './routes/user.js'
import lessonRouter from './routes/lesson.js'
import programRouter from './routes/program.js'

const app = express()
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json())

app.use('/user',userRouter);
app.use('/program',programRouter);
app.use('/lesson',lessonRouter);

app.listen(8800, () => {
    console.log("Backend server is running!")
})



