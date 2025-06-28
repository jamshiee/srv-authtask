import express from 'express'
import { loginController, registerController, tokenController } from '../controller/authController.js'

const router = express.Router()

router.post('/register',registerController)
router.post('/login',loginController)
router.post('/refreshToken',tokenController)

export default router