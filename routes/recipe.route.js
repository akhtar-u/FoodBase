const express = require("express");
const router = express.Router();

const recipe_controller = require("../controllers/recipe.controller");
// adding a new recipe
router.post("/add", recipe_controller.recipe_add);
// for testing
router.get("/test", recipe_controller.test);

module.exports = router;
