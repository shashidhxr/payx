import express from 'express'
import account from './routes/account.js'
import pay from './routes/pay.js'
import admin from './routes/admin.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.json("Hi")
})

app.use('/api/v1/account', account)
app.use('/api/v1/pay', pay)
app.use('/api/v1/admin', admin)


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})