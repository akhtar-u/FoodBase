const Recipe = require("../models/recipe.model");

// add a new recipe
exports.recipe_add = function (req, res) {
  let recipe = new Recipe({
    userid: req.body.userid,
    recipename: req.body.recipename,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
  });

  recipe
    .save()
    .then(() => res.json("Recipe Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
};
// test route
exports.test = function (req, res) {
  res.send("Greetings from the Test controller!");
};
