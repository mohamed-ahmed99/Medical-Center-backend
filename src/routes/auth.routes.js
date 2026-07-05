import express from 'express'
import upload from '../middlewares/upload.middleware.js'
import { createAccount, requestedFields } from '../controllers/auth/createAccount.js'

const authRouter = express.Router()

authRouter.post('/create-account', upload.fields(requestedFields), createAccount)

export default authRouter