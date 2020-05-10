const express = require('express');
const router = express.Router();

const recipe_controller = require('../controllers/recipe.controller');
// adding a new recipe
router.post('/add', recipe_controller.recipe_add);

// fetch all recipes by userid
router.get('/:id', recipe_controller.recipes_list);

// fetch a recipes by id
router.get('/:id/view', recipe_controller.recipe_view);

// fetch images of all recipes that are public
router.get('/public/:id', recipe_controller.recipe_public);

// fetch public recipe being clicked
router.get('/image/:id', recipe_controller.recipe_pubrec);

// update recipe
router.put('/:id/update', recipe_controller.recipe_update);

//delete recipe
router.delete('/:id/delete', recipe_controller.recipe_delete);

module.exports = router;
