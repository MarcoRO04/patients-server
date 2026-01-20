const express = require('express');
const fs = require("node:fs");
const router = express.Router();

/*get the list of patients from patients.json*/
function getPatientsList(){
    try{
        return JSON.parse(fs.readFileSync('./patients.json', 'utf8'))
    }catch(err){
        console.log(err);
    }
}
/*get all patients*/
router.get('/', (req, res) => {
    let patients_list_from_file = getPatientsList();
    res.send({list: patients_list_from_file});
})

module.exports = router;