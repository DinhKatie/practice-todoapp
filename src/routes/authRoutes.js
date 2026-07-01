import express from 'express'
import bcrypt, { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Dont need to add /auth because server.js handles it
router.post('/register', (req, res) => {
    const { username, password } = req.body
    
    const hashPassword = bcrypt.hashSync(password, 8)
    
    // Save hash to db
    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password)
            VALUES (?, ?)`)
        const result = insertUser.run(username, hashPassword)

        //Default todo
        const defaultTodo = 'Hello, this is your first todo! Time to be productive!'
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES(?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        // create token to keep user authenticated
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    try {
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const user = getUser.get(username)

        if (!user) { return res.status(404).send({message: "User not found"})}

        // compare passwords
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) { return res.status(401).send({message: "Invalid password"})}

        console.log(user)
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})

        res.json({token})

    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

})

export default router