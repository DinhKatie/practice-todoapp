import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Dont need to add /auth because server.js handles it
router.post('/register', (req, res) => {

})

export default router