const express = require('express');
const { env } = require('process');
const app = express();
const router = require('./router');

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());    
app.use(router);


app.listen(PORT, () => {
    try{
        console.log(`Server start on ${PORT}`)
    }catch(e){
        console.log(e)
    }
})