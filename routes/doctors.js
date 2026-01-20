const express = require('express');
const fs = require("node:fs");
const router = express.Router();

/*get the list of doctors from doctors.json*/
function getDoctorsList(){
    try{
        return JSON.parse(fs.readFileSync('./doctors.json', 'utf8'))
    }catch(err){
        console.log(err);
    }
}
/*get all doctors*/
router.get('/', (req, res) => {
    let doctors_list_from_file = getDoctorsList();
    res.send({list: doctors_list_from_file});
})

module.exports = router;