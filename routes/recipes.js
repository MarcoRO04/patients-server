const express = require('express');
const fs = require("node:fs");
const router = express.Router();
const {Client} = require("pg");

const client = new Client({
    host: 'localhost',
    user: 'marcorotunjanu',
    port: 5432,
    password: '291104',
    database: 'casa-fabian',
});

client.connect()


/*calculate the future renewal date, the distance between prescriptions and the status of the prescription
(these are dynamic properties that change often - that's why they are not saved) */
function calculate_r_properties_for_JSON(recipe){
    let new_recipe = {id: '', patient: {name: ''}, doctor: {name: '', specialization: ''}, future_prescription_date: '', recipe_duration: '',
        prescription_dates: [], status: '', distance_between_prescriptions: '', pills_list:[]};
    new_recipe.id = recipe.id;
    new_recipe.patient = recipe.patient;
    new_recipe.doctor = recipe.doctor;
    new_recipe.recipe_duration = recipe.recipe_duration;
    new_recipe.prescription_dates = recipe.prescription_dates;
    new_recipe.pills_list = recipe.pills_list;

    let recipe_period = new_recipe.recipe_duration.split(' ')
    new_recipe.future_prescription_date = new Date(Date.parse(new_recipe.prescription_dates[new_recipe.prescription_dates.length - 1]) + recipe_period[0] * 30 * 24 * 60 * 60 * 1000)
    new_recipe.distance_between_prescriptions = Math.round((Date.parse(new_recipe.future_prescription_date) - Date.now()) / 8.64e7).toString()
    if (new_recipe.distance_between_prescriptions < 0) {
        new_recipe.status = '1'
    } else if (new_recipe.distance_between_prescriptions >= 0 && new_recipe.distance_between_prescriptions <= 7) {
        new_recipe.status = '1'
    } else if (new_recipe.distance_between_prescriptions >= 8 && new_recipe.distance_between_prescriptions <= 14) {
        new_recipe.status = '2'
    } else {
        new_recipe.status = '3'
    }
    return new_recipe;
}

function calculate_r_properties_for_DB(recipe){
    let new_recipe = {id: '', patient: {name: ''}, doctor: {name: '', specialization: ''}, future_prescription_date: '', recipe_duration: '',
        prescription_dates: [], status: '', distance_between_prescriptions: '',pills_list:[]};
    new_recipe.id = recipe.id;
    new_recipe.patient.name = recipe.patient_name;
    new_recipe.doctor.name = recipe.doctor_name;
    new_recipe.doctor.specialization = recipe.doctor_specialization;
    new_recipe.recipe_duration = recipe.duration;
    new_recipe.prescription_dates = JSON.parse(recipe.prescription_dates);
    new_recipe.pills_list = recipe.pills_list;

    let recipe_period = new_recipe.recipe_duration.split(' ')
    new_recipe.future_prescription_date = new Date(Date.parse(new_recipe.prescription_dates[new_recipe.prescription_dates.length - 1]) + recipe_period[0] * 30 * 24 * 60 * 60 * 1000)
    new_recipe.distance_between_prescriptions = Math.round((Date.parse(new_recipe.future_prescription_date) - Date.now()) / 8.64e7).toString()
    if (new_recipe.distance_between_prescriptions < 0) {
        new_recipe.status = '1'
    } else if (new_recipe.distance_between_prescriptions >= 0 && new_recipe.distance_between_prescriptions <= 7) {
        new_recipe.status = '1'
    } else if (new_recipe.distance_between_prescriptions >= 8 && new_recipe.distance_between_prescriptions <= 14) {
        new_recipe.status = '2'
    } else {
        new_recipe.status = '3'
    }
    return new_recipe;
}
/*get the list of prescriptions from the JSON file and add the dynamic properties to each recipe*/
function getRecipesListFromJSON() {
    try {
        let recipes_list = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'))
        for (let recipe in recipes_list) {
            recipes_list[recipe] = calculate_r_properties_for_JSON(recipes_list[recipe]) /*add properties to each recipe inside the list*/
        }
        return recipes_list
    } catch (err) {
        console.error(err);
    }
}

/*get prescriptions from DB*/
async function getRecipesFromDB(){
    const select_recipes_query = {
        text:`SELECT * FROM prescriptions`,
    }
    const res = await client.query(select_recipes_query);
    let recipes_list = res.rows;
    for (let recipe in recipes_list) {
        recipes_list[recipe] = calculate_r_properties_for_DB(recipes_list[recipe]) /*add properties to each recipe inside the list*/
    }
    return recipes_list;
}

/*add the new recipe to the list and then save it to the JSON file*/
function writeUpdatedRecipesListInJSON(recipe) {
    try {
        let recipesList = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));
        // console.log(recipesList);
        recipesList.push(recipe)
        // console.log(recipesList)
        fs.writeFileSync('./recipes.json',JSON.stringify(recipesList,null, 2),'utf-8');
    } catch (err) {
        console.error(err);
    }
}

/*compute for each part of the date the pills distribution: pill_id:quantity#another_pill_id:quantity....*/
function computePillsPrescriptionString(pills_list){
    let pills_configuration = {
        morning: '',
        lunch:'',
        dinner:'',
        before_bed:'',
    }

    for (let pill_index = 0; pill_index < pills_list.length; pill_index++)
    {
        if (pill_index !== pills_list.length - 1)
        {
            pills_configuration.morning += pills_list[pill_index].id + ":" + pills_list[pill_index].morning + "#"
            pills_configuration.lunch += pills_list[pill_index].id + ":" + pills_list[pill_index].lunch + "#"
            pills_configuration.dinner += pills_list[pill_index].id + ":" + pills_list[pill_index].dinner + "#"
            pills_configuration.before_bed += pills_list[pill_index].id + ":" + pills_list[pill_index].before_bed + "#"
        }
        else
        {
            pills_configuration.morning += pills_list[pill_index].id + ":" + pills_list[pill_index].morning
            pills_configuration.lunch += pills_list[pill_index].id + ":" + pills_list[pill_index].lunch
            pills_configuration.dinner += pills_list[pill_index].id + ":" + pills_list[pill_index].dinner
            pills_configuration.before_bed += pills_list[pill_index].id + ":" + pills_list[pill_index].before_bed
        }
    }
    // compute every property like : code_medicament: numar # code_medicament: numar ....
    return pills_configuration
}

/*add new recipe to DB*/
async function addNewRecipeToDB(recipe) {
    // console.log(recipe.pills_list)
    const insert_prescriptions = {
        text: `INSERT INTO prescriptions (id, duration, prescription_dates, patient_name, doctor_name, doctor_specialization) VALUES ('${recipe.id}', '${recipe.recipe_duration}', '${JSON.stringify(recipe.prescription_dates)}', '${recipe.patient.name}', '${recipe.doctor.name}','${recipe.doctor.specialization}')`,
    }

    await client.query(insert_prescriptions);

    // console.log(res)

    let pills_configuration = computePillsPrescriptionString(recipe.pills_list)
    console.log(recipe.name)
    const insert_prescription_pills = {
        text: `INSERT INTO prescription_pills (id, morning, lunch, dinner, before_bed) VALUES ('${recipe.id}','${pills_configuration.morning}', '${pills_configuration.lunch}', '${pills_configuration.dinner}', '${pills_configuration.before_bed}')`,
    }

    await client.query(insert_prescription_pills);

    return true
}

/*edit recipe details in JSON*/
function writeUpdatedRecipe(r) {
    try {
        let recipesList = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));
        for (let recipe in recipesList) {
            if (recipesList[recipe].id === r.id) {
                recipesList[recipe] = r;
            }
        }
        fs.writeFileSync('./recipes.json', JSON.stringify(recipesList, null, 2), 'utf-8');
    } catch (err) {
        console.error(err);
    }
}

async function updateRecipeInDB(r) {
    const update_prescriptions_table = {
        text:`UPDATE prescriptions 
              SET id = '${r.id}', duration = '${r.recipe_duration}', 
                  prescription_dates = '${JSON.stringify(r.prescription_dates)}', patient_name = '${r.patient.name}', 
                  doctor_name = '${r.doctor.name}', doctor_specialization = '${r.doctor.specialization}'
              WHERE id = '${r.id}';`,
    }
    await client.query(update_prescriptions_table,(error) => {
        if (error) {
            console.error(error);
        }
    })
    const update_prescription_pills_table = {
        text:`UPDATE prescription_pills 
              SET id = '${r.id}', morning = '${r.pills_distribution.morning}', 
                  lunch = '${r.pills_distribution.lunch}', dinner = '${r.pills_distribution.dinner}', 
                  before_bed = '${r.pills_distribution.before_bed}'
              WHERE id = '${r.id}';`,
    }
    await client.query(update_prescription_pills_table,(error) => {
        if (error) {
            console.error(error);
        }
    })

    return true
}

/*delete recipe*/
function getRecipeIndexById(id) {
    let recipesList = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));
    for (let recipeIndex = 0; recipeIndex < recipesList.length; recipeIndex++) {
        if (recipesList[recipeIndex].id === id) {
            return recipeIndex
        }
    }
}

/*get the id of the deleted recipe*/
function deleteRecipeByIdJSON(id) {
    let recipesList = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));
    let searchedRecipeIndex = getRecipeIndexById(id);
    if (searchedRecipeIndex > -1) {
        recipesList.splice(searchedRecipeIndex, 1)
        fs.writeFileSync('./recipes.json', JSON.stringify(recipesList, null, 2), 'utf-8');
    }
}

/*delete recipe in DB*/
async function deleteRecipeInDB(id) {
    const query = {
        text: `DELETE FROM prescriptions WHERE id = '${id}'`
    }

    await client.query(query,(error) => {
        if (error) {
            console.error(error);
        }
    })
    const query1 = {
        text: `DELETE FROM prescription_pills WHERE id = '${id}'`
    }

    await client.query(query1,(error) => {
        if (error) {
            console.error(error);
        }
    })
}

/* get all recipes */
router.get('/', function (req, res) {
    getRecipesFromDB().then((recipes_list) => {
        res.send({list: recipes_list});
    })
})


/* post new resource - recipe*/
router.post('/new',function(req,res){
    const recipe = req.body;
    addNewRecipeToDB(recipe).then((result)=>{
        if (result){
            res.send({status:true,rsp:"Am salvat lista de retete cu success!"});
        }else{
            res.send({status:false,rsp:"Insertion failed"});
        }
    }).catch((err)=>{
        res.send({status:false,rsp:"insertion query function failed"});
    })
})

/*delete recipe*/
router.delete('/:id',function(req,res){
    let id = req.params.id;
    deleteRecipeInDB(id)
    res.send({result:true})
})

/*edit recipe details*/
router.put('/:id',function(req,res){
    let recipe = req.body;
    console.log(req.body);
    updateRecipeInDB(recipe).then((result)=>{
        console.log("result: " + result);
        if (result){
            res.send({status:true,rsp:"Am actualizat lista de retete cu success!"});
        }else{
            res.send({status:false,rsp:"Update failed"});
        }
    }).catch((err)=>{
        res.send({status:false,rsp:"update query function failed"});
    })
})

// module.exports = Client;
module.exports = router;