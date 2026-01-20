const express = require('express');
const fs = require("node:fs");
const router = express.Router();

/*each time the FE makes a request to get list or recipes, firstly recalculate all the recipes statuses and date differences until their renewal*/
function recalculate_distance_between_prescriptions(recipesList) {
    let status_changed_cnt = 0
    for (let recipe in recipesList) {
        //the difference between the future prescription and the current date, converted from milliseconds to days, and from number to string
        const date_difference = Math.round((Date.parse(recipesList[recipe].future_prescription_date) - Date.now()) / 8.64e7).toString()
        //if the date obtained is different, then modify the status
        if (recipesList[recipe].distance_between_prescriptions !== date_difference) {
            status_changed_cnt++
            recipesList[recipe].distance_between_prescriptions = date_difference
            if (recipesList[recipe].distance_between_prescriptions < 0) {
                recipesList[recipe].status = '1'
            } else if (
                recipesList[recipe].distance_between_prescriptions >= 0 &&
                recipesList[recipe].distance_between_prescriptions <= 7
            ) {
                recipesList[recipe].status = '1'
            } else if (
                recipesList[recipe].distance_between_prescriptions >= 8 &&
                recipesList[recipe].distance_between_prescriptions <= 14
            ) {
                recipesList[recipe].status = '2'
            } else {
                recipesList[recipe].status = '3'
            }
        }
    }
    if (status_changed_cnt > 0) {
        fs.writeFileSync('./recipes.json',JSON.stringify(recipesList,null, 2),'utf-8');
    }
}


function getRecipesList() {
    try {
        /*before sending the list, I want to recalculate the recipes dates*/
        recalculate_distance_between_prescriptions(JSON.parse(fs.readFileSync('./recipes.json', 'utf8')))
        // console.log(fs.readFileSync('./recipes.json', 'utf8'))
        return fs.readFileSync('./recipes.json', 'utf8')
    } catch (err) {
        console.error(err);
    }
}
/*Besides calculating the future prescription date, based on the current date,
     * this function also sets the status of the recipe and calculated the distance in days until the next renewal
     * the status should be always '3'
       but if, idk, the recipe was prescribed 2-3 weeks ago, we check it, and put the status accordingly
     * */

function calculate_recipe_properties(recipe){
        let recipe_period = []
        recipe_period = recipe.recipe_duration.split(' ')

        //The future prescription date is the current date in milliseconds + the recipe duration converted in milliseconds
        recipe.future_prescription_date = new Date(Date.parse(recipe.current_prescription_date) + recipe_period[0] * 30 * 24 * 60 * 60 * 1000,)

        if (Date.parse(recipe.future_prescription_date) > Date.now()) {
            const dates_difference = Date.parse(recipe.future_prescription_date) - Date.now()
            const day = 8.64e7 // how many milliseconds in a day

            //set the initial difference between dates (it will be changed later, every day)
            recipe.distance_between_prescriptions = Math.round(dates_difference / day)
            if (recipe.distance_between_prescriptions >= 0 && recipe.distance_between_prescriptions <= 7) {
                //red
                recipe.status = '1'
            } else if (recipe.distance_between_prescriptions >= 8 && recipe.distance_between_prescriptions <= 14) {
                //orange
                recipe.status = '2'
            } else {
                //green
                recipe.status = '3'
            }
            return recipe
        }
        return null
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
    let recipes_list_from_file = JSON.parse(getRecipesList());
    res.send({list : recipes_list_from_file});
})

/*get recipe with id*/
// router.get('/:id', function (req, res) {
//     let id = req.params.id
//     console.log(id)
//     let searched_recipe = getRecipeIndexById(id) // I changed the getRecipeById() to get the index of the recipe
//     res.send({result: searched_recipe})
// })

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