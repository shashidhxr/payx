import express from 'express'
const router = express.Router()

router.get('/branches', (req, res) => {
    res.send("returns all the branch details")
})

router.get('/loans', (req, res) => {
    res.send("loan details")
})

export default router