const express = require("express");
const router = express.Router();

const recipe_controller = require("../controllers/recipe.controller");
// adding a new recipe
router.post("/add", recipe_controller.recipe_add);

// fetch recipe
router.get("/:id", recipe_controller.recipe_view);

// update recipe
router.put("/:id/update", recipe_controller.recipe_update);

//delete recipe
router.delete("/:id/delete", recipe_controller.recipe_delete);

module.exports = router;
