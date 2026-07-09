import { Router } from 'express'
import { newDay } from '../controllers/secretary/newDay.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js'
import { getAllDays } from '../controllers/secretary/getAllDays.js'

const secretaryRouter = Router()


//  new day
secretaryRouter.post("/new-day", verifyToken('Medical_Center_Auth', 'Secretary'), newDay)


// get all days
secretaryRouter.get("/days", verifyToken('Medical_Center_Auth'), getAllDays)


export default secretaryRouter