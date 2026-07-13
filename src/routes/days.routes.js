import { Router } from 'express'
import { newDay } from '../controllers/days/newDay.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js'
import { getAllDays } from '../controllers/days/getAllDays.js'

const daysRouter = Router()


//  new day
daysRouter.post("/new-day", verifyToken('Medical_Center_Auth', 'Secretary'), newDay)


// get all days
daysRouter.get("/days", verifyToken('Medical_Center_Auth'), getAllDays)


export default daysRouter