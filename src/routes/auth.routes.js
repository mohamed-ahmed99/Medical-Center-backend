import express from 'express'
import upload from '../middlewares/upload.middleware.js'
import { createAccount, requestedFields } from '../controllers/auth/createAccount.js'
import { login } from '../controllers/auth/login.js'
import { logout } from '../controllers/auth/logout.js'
import {verifyToken} from '../middlewares/verifyToken.middleware.js'
import { verifyMe } from '../controllers/auth/verifyMe.js'

const authRouter = express.Router()

// sign up
authRouter.post('/create-account', upload.fields(requestedFields), createAccount)

// login
authRouter.post('/login', login)


// logout
authRouter.post('/logout', verifyToken("Medical_Center_Auth"), logout)

// verify me
authRouter.get('/verify-me', verifyToken("Medical_Center_Auth"), verifyMe)


export default authRouter