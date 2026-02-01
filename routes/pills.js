const express = require('express');
const { SerialPort,ReadlineParser} = require("serialport");
const router = express.Router();


// const port = new SerialPort({path: "/dev/cu.usbmodem1101", baudRate: 9600})
// const parser = new ReadlineParser();
//
// port.pipe(parser)
//
// function arduinoResponse(test_type) {
//     return new Promise((resolve,reject) => {
//         port.on("open", () => {
//             console.log("Connecting to the Arduino board...");
//         })
//
//         setTimeout(function(){
//             port.write(test_type + "\n");
//         },2000)
//
//         parser.on("data",function (data){
//             resolve(data)
//         })
//         // parser.on("error",(err) => {
//         setTimeout(function(err){
//             reject("no response");
//         },25000);
//         // })
//
//     })
// }
//
// router.get('/:test_type',async (req, res) => {
//     let test_type = req.params.test_type
//     arduinoResponse(test_type).then( resolve => {
//         res.send({result:resolve});
//     }).catch(()=>{console.log('reject')
//         res.send({result:'no response'});
//     })
// })
//

module.exports = router;