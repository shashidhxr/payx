import express from 'express'
const router = express.Router()

router.post('/', (req, res) => {
    const { sender, recipient } = req.query
    if(!sender || !recipient){
        return res.status(400).send("missing sender or recipient")
    }
    res.send('pay post')
})

router.get('/transactions', (req, res) => {
    res.send("all trasnactins of that user")
})

export default router