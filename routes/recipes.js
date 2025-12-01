const express = require('express');
const fs = require("node:fs");
const router = express.Router();

function getRecipesList() {
    try {
        return fs.readFileSync('./recipes.json', 'utf8');
    } catch (err) {
        console.error(err);
    }
}

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

function getRecipeById(id) {
    let recipesList = JSON.parse(fs.readFileSync('./recipes.json', 'utf8'));
    for (let recipe in recipesList) {
        if (recipesList[recipe].id === id) {
            return recipesList[recipe]
        }
    }
}

/* get all recipes */
router.get('/', function (req, res) {
    let recipes_list_from_file = JSON.parse(getRecipesList());
    res.send(recipes_list_from_file);
})

/*get recipe with id*/
router.get('/:id', function (req, res) {
    let id = req.params.id
    console.log(id)
    let searched_recipe = getRecipeById(id)
    res.send({result: searched_recipe})
})
/* post new resource - recipe*/
router.post('/new',function(req,res){
    const recipe = req.body;
    console.log(recipe);
    writeUpdatedRecipesList(recipe)
    res.send({status:true,rsp:"Am salvat lista de retete cu success!"});
})

/*delete recipe*/
router.delete('/:id',function(req,res){
    let id = req.params.id;
    console.log(id)
    res.send({result:id})
})

/*edit recipe details*/
router.put('/:id',function(req,res){
    let id = req.params.id;
    let recipe = req.body;
    console.log(recipe)
    res.send({result:true})
})

module.exports = router;