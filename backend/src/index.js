import express from 'express'

import accountRouter from './routes/account.js'
import payRouter from './routes/pay.js'
import adminRouter from './routes/admin.js'
import userRouter from './routes/users.js'
import loanRouter from './routes/loan.js'
import branchRouter from './routes/branch.js'
import authRouter from './routes/auth.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.json("Hi")
})

app.use('/api/v1/account', accountRouter)
app.use('/api/v1/transactions', payRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/loan', loanRouter)
app.use('/api/v1/branch', branchRouter)
app.use('/api/v1/auth', authRouter)


app.listen(3000, () => {
    console.log("Server is running at port 3000")
})