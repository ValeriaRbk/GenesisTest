const e = require('express');
const { Router, json } = require('express');
const router = Router();
const request = require('request-promise')
const fs = require('fs');
const { callbackPromise } = require('nodemailer/lib/shared');
const nodemailer = require('nodemailer')

class APIController{
    async GetRate(req, res){
        try{
            let rate = await getRate()
            if(rate) return res.status(200).send({ description: 'Повертається актуальний курс BTC до UAH', uah: rate })
            else throw e
        }catch(e){
            return res.status(400).send({ message: 'Invalid status value' }); 
        }
    }


    async Subscribe(req, res){
        try{
            const newEmail = req.body.email;
            if(!emailTest(newEmail)) throw err 
        
            fs.readFile('database.txt', 'utf8', (err, data) => {
                if(err) throw err
                let emails = data.split(',');
    
                for(let email of emails){
                    if(newEmail === email) return res.status(409).send({ message: 'Даний email вже є в базі даних' });
                }
                emails = emails.toString()
                emails += `${newEmail},`
    
                fs.writeFile('database.txt', emails, (err) => { if(err) throw err; })
    
                return res.status(200).send({ message: 'E-mail додано' }); 
            });

        }catch(e){ 
            return res.status(409).send({ message: 'Email не підходить' }); 
        }
    }

    async SendEmails(req, res){
        try{
            let rate = +await getRate();
            rate = rate.toString()
    
            fs.readFile('database.txt', 'utf8', (err, data) => {
                if(err) throw err
                let emails = data.split(',');
                
                for(let i=0; i < emails.length-1; i++){
                    console.log(emails[i])
                    mailer(rate, emails[i])
                }
                // emails.forEach(e => { mailer(rate, e) })
            });
            return res.status(200).send({ message: 'E-mailʼи відправлено' })

        }catch(e){
            console.log(e); 
            return res.status(500).send({ message: 'Помилка запиту' });
        }
    }


}

module.exports = new APIController();

function emailTest(email){
    const validate = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    console.log(email.match(validate))
    return email.match(validate)
}

async function getRate(){
    let rate
    await request(
        'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,UAH',
        {json: true},
        (err, response, body) => {  if (err) return err }
    ).then(uah => { rate = uah })
    return rate.UAH
}

const mailer = async (rate, email) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: 'courtney.steuber37@ethereal.email',
            pass: 'TccGbBxgVrSHXXWj3A'
        }
    });

    let mailDetails = {
        from: 'From <courtney.steuber37@ethereal.email>',
        to: email,                   //change
        subject: 'Bitcoin to hryvna new rate',
        text: `Bitcoin to hryvna rate has been changed. Now 1 BTC cost ${rate} hryvnas`,
    }
    
    await transporter.sendMail(mailDetails, function(err, data) {
        if(err) console.log(err); 
    })
}