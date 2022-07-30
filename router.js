const { Router, json } = require('express');
const router = Router();
const APIController = require('./APIController')

router.all('/api/rate', APIController.GetRate)

router.post('/api/subscribe', APIController.Subscribe)

router.all('/api/sendEmails', APIController.SendEmails)

router.all('/', (req, res) => { res.redirect('/api/rate') })

module.exports = router;