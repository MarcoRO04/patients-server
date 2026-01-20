const express = require('express');
const fs = require("node:fs");
const router = express.Router();


function calculate_r_properties(recipe){
    let new_recipe = {id: '', patient: {name: ''}, doctor: {name: '', specialization: ''}, future_prescription_date: '', recipe_duration: '',
        prescription_dates: [], status: '', distance_between_prescriptions: ''};
    new_recipe.id = recipe.id;
    new_recipe.patient = recipe.patient;
    new_recipe.doctor = recipe.doctor;
    new_recipe.recipe_duration = recipe.recipe_duration;
    new_recipe.prescription_dates = recipe.prescription_dates;

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

function getRecipesList() {
    try {
        let recipes_list = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'))
        for (let recipe in recipes_list) {
            recipes_list[recipe] = calculate_r_properties(recipes_list[recipe]) /*add properties to each recipe inside the list*/
        }
        return recipes_list
    } catch (err) {
        console.error(err);
    }
}
/*add the new recipe to the list*/
function writeUpdatedRecipesList(recipe) {
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

/*edit recipe details*/
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
function deleteRecipeById(id) {
    let recipesList = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));
    let searchedRecipeIndex = getRecipeIndexById(id);
    if (searchedRecipeIndex > -1) {
        recipesList.splice(searchedRecipeIndex, 1)
        fs.writeFileSync('./recipes.json', JSON.stringify(recipesList, null, 2), 'utf-8');
    }
}

/* get all recipes */
router.get('/', function (req, res) {
    let recipes_list_with_complete_properties = getRecipesList();
    res.send({list : recipes_list_with_complete_properties});
})

/* post new resource - recipe*/
router.post('/new',function(req,res){
    const recipe = req.body;
    // console.log(recipe);
    writeUpdatedRecipesList(recipe)
    res.send({status:true,rsp:"Am salvat lista de retete cu success!"});
})

/*delete recipe*/
router.delete('/:id',function(req,res){
    let id = req.params.id;
    // console.log(id);
    deleteRecipeById(id)
    res.send({result:true})
})

/*edit recipe details*/
router.put('/:id',function(req,res){
    // let id = req.params.id;
    let recipe = req.body;
    // console.log("id:" + recipe.id)
    writeUpdatedRecipe(recipe)
    res.send({result:true})
})

module.exports = router;