const express = require('express');
const {SerialPort, ReadlineParser} = require("serialport");
const router = express.Router();

let boardConnected = true

const port = new SerialPort({path: "/dev/cu.usbmodem11101", baudRate: 9600},(error) =>
{
    if (error) {
        console.log('Error: ', error.message)
        boardConnected = false
    }
})
const parser = new ReadlineParser();

port.pipe(parser)

function arduinoResponse(test_type) {
    return new Promise((resolve,reject) => {
        port.on("open", () => {
            console.log("Connecting to the Arduino board...");
        })

        setTimeout(function(){
            port.write(test_type + "\n");
        },2000)

        parser.on("data",function (data){
            resolve(data)
        })
        // parser.on("error",(err) => {
        //daca nu primesc nimic de la arduino in 25 de secunde, se trimite mesajul "no response" (in momentul de fata, se trimite indiferent daca am sau nu un raspuns
        setTimeout(function(err){
            reject("no response");
        },25000);
        // })

    })
}

router.get('/:test_type',async (req, res) => {
    if (!boardConnected){
        res.send({arduino: false, result:'board not connected'});
    }else{
        let test_type = req.params.test_type
        arduinoResponse(test_type).then( resolve => {
            res.send({arduino: true, result:resolve});
        }).catch(()=>{console.log('no response from arduino board')
            res.send({arduino: true, result:'no response'});
        })
    }
})

router.get('/connect',async (req, res) => {
    if (!boardConnected){
        res.send({arduino: false});
    }else{
        res.send({arduino: true});
    }
})


module.exports = router;