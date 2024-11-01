import express from 'express'
const router = express.Router()

router.post('/create', (req, res) => {
    res.send("account created")
})

router.delete('/delete', (req, res) => {
    res.send("account deleted")
})

router.post('/deposit', (req, res) => {
    res.send("account created")
})

router.post('/withdraw', (req, res) => {
    res.send("account created")
})

export default router