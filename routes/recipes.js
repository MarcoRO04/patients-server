var express = require('express');
var router = express.Router();

function getMyData() {
    const fs = require('node:fs');
    try {
        const data = fs.readFileSync('./recipes.json', 'utf8');
        console.log(data);
        return data;
    } catch (err) {
        console.error(err);
    }
}

router.get('/', function (req, res) {
    console.log('test recipes');
    console.log(req.query);
    let myrecipefromfile = JSON.parse(getMyData())
    console.log(myrecipefromfile)
    let myrecipe = {
        id: '33',
        patient: {
            name: 'Marco',
        },
        doctor: {
            name: 'Dani',
            specialization: 'X',
        },
        recipe_duration: '',
            distance_between_prescriptions: '23',
            future_prescription_date: '12',
            current_prescription_date: '66',
            last_prescription_dates: '13',
            status: 'ttttt',
    }
    let myrsp = {
        status:true,rsp:myrecipefromfile
    }
    res.send({status:true,rsp:myrecipefromfile});
    //res.render('recipes', {})
})

module.exports = router;