import express from 'express'
const router = express.Router()

router.post('/', (req, res) => {
    const { sender, recipient } = req.query
    if(!sender || !recipient){
        return res.status(400).send("missing sender or recipient")
    }
    res.send('pay post')
})

router.get('/transactions/:accountNumber', (req, res) => {
    res.send("all transactions of the account")
})

export default router