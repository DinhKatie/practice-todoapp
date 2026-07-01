import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express()
const PORT = process.env.PORT || 5003

//Get file path from URL of current module
const __filename = fileURLToPath(import.meta.url)
// Get directory name from file path
const __dirname = dirname(__filename)

//Server html file from public directory (not src) + all files from public are static assets/files
app.use(express.static(path.join(__dirname, '../public')))

app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Routes
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`)
})