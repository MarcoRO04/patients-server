const express = require('express');
const {SerialPort, ReadlineParser} = require("serialport");
const {readSheet} = require("read-excel-file/node");
const fs = require("node:fs");
const {Client} = require("pg");
const router = express.Router();

const client = new Client({
    host: 'localhost',
    user: 'marcorotunjanu',
    port: 5432,
    password: '291104',
    database: 'casa-fabian',
});

client.connect()

let boardConnected = true

const port = new SerialPort({path: "/dev/cu.usbmodem1401", baudRate: 9600},(error) =>
{
    if (error) {
        console.log('Error: ', error.message)
        boardConnected = false
    }
})
const parser = new ReadlineParser();

port.pipe(parser)


/*get pills configuration for patient*/
async function getPillsConfigurationFromDB(prescription_id){
    // console.log(prescription_id);
    const select_prescription_configuration = {
        text:`SELECT * FROM prescription_pills WHERE id = '${prescription_id}'`,
    }
    const res = await client.query(select_prescription_configuration);
    console.log(res.rows);
    return res.rows;
}

/*extract the digits out of the pills distribution string. An array of 20 digits is obtained.*/
function extractPillsFromPrescriptionRow(pills_configuration_list){
    let configuration = "";
    let pills_and_pills_quantity_morning = pills_configuration_list[0].morning.split("#");
    for (let i = 0; i < pills_and_pills_quantity_morning.length; i++) {
        let pill_quantity_morning = pills_and_pills_quantity_morning[i].split(":");
        configuration += pill_quantity_morning[1];
    }
    for (let i = 0; i < 5 - pills_and_pills_quantity_morning.length; i++) {
        configuration += "0";
    }

    let pills_and_pills_quantity_lunch = pills_configuration_list[0].lunch.split("#");
    for (let i = 0; i < pills_and_pills_quantity_lunch.length; i++) {
        let pill_quantity_lunch = pills_and_pills_quantity_lunch[i].split(":");
        configuration += pill_quantity_lunch[1];
    }

    for (let i = 0; i < 5 - pills_and_pills_quantity_morning.length; i++) {
        configuration += "0";
    }

    let pills_and_pills_quantity_dinner = pills_configuration_list[0].dinner.split("#");
    for (let i = 0; i < pills_and_pills_quantity_dinner.length; i++) {
        let pill_quantity_dinner = pills_and_pills_quantity_dinner[i].split(":");
        configuration += pill_quantity_dinner[1];
    }

    for (let i = 0; i < 5 - pills_and_pills_quantity_morning.length; i++) {
        configuration += "0";
    }

    let pills_and_pills_quantity_before_bed = pills_configuration_list[0].before_bed.split("#");
    for (let i = 0; i < pills_and_pills_quantity_before_bed.length; i++) {
        let pill_quantity_before_bed = pills_and_pills_quantity_before_bed[i].split(":");
        configuration += pill_quantity_before_bed[1];
    }

    for (let i = 0; i < 5 - pills_and_pills_quantity_morning.length; i++) {
        configuration += "0";
    }

    console.log(configuration);
    return configuration;
}


/*This is the function responsible for sending the request from the frontend further to the prototype.
* It opens a connection, and write on the port the test type of the array that will be used for dispensing. */
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
        setTimeout(function(err){
            reject("no response");
        },25000);
        // })

    })
}

/*this function is used to extract in a JSON file all the pills that are comercialized in Romania from the NOMENCLATOR*/
async function readXLSFile(){
    const data = await readSheet('./nomenclator.xlsx')
    let pills_lst = []
    for(let i=1; i < data.length; i++){
        let pill = {
            id:'',
            name:'',
        }
        pill.id = data[i][0]
        pill.name = data[i][1]
        pills_lst.push(pill)
    }
    try{
        fs.writeFileSync('./pills.json',JSON.stringify(pills_lst,null, 2),'utf-8');
    }catch(err){
        console.log(err);
    }
}

function getPillsFromJSON(){
    try {
        return JSON.parse(fs.readFileSync('./pills.json', 'utf8'))
    } catch (err) {
        console.error(err);
    }
}
//readXLSFile();

router.get('/test/:test_type',async (req, res) => {
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

/* sort pills for patient*/
router.get('/sort/:id',async (req, res) => {
    let id = req.params.id;
    let pills = getPillsConfigurationFromDB(id)
        .then((recipe_pills) => {
            res.send({result: extractPillsFromPrescriptionRow(recipe_pills)});
    })

})

/* sort pills for patient*/
router.get('/pills_configuration/:id',async (req, res) => {
    let id = req.params.id;
    console.log(id);
    let pills = getPillsConfigurationFromDB(id)
        .then((recipe_pills) => {
            res.send({result: recipe_pills});
        })

})


router.get('/connect',async (req, res) => {
    if (!boardConnected){
        res.send({arduino: false});
    }else{
        res.send({arduino: true});
    }
})

/*get the pills extracted in the JSON file from the NOMENCLATOR*/
router.get('/', async (req, res) => {
    let pills_list = getPillsFromJSON();
    res.send({list: pills_list});
})


module.exports = router;