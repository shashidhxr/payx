import express from 'express'
const router = express.Router()

router.get('/status', (req, res) => {
    res.send("loan status")
})

router.post('/apply', (req, res) => {
    res.send("loan status")
})

router.delete('/cancel', (req, res) => {
    res.send("cancel loan")
})

export default router