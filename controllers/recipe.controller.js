const Recipe = require("../models/recipe.model");

// add a new recipe
exports.recipe_add = (req, res) => {
  let recipe = new Recipe({
    userid: req.body.userid,
    recipename: req.body.recipename,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
  });

  recipe
    .save()
    .then(() => res.json("Recipe Added!"))
    .catch((err) => res.status(400).json("Error: " + err));
};

// fetch recipe
exports.recipe_view = (req, res) => {
  Recipe.findById(req.params.id)
    .then((recipe) => res.json(recipe))
    .catch((err) => res.status(400).json("Error: " + err));
};

// update a recipe
exports.recipe_update = (req, res) => {
  Recipe.findOneAndUpdate(req.params.id, { $set: req.body })
    .then((recipe) => res.json("Recipe Updates"))
    .catch((err) => res.status(400).json("Error: " + err));
};

// delete a recipe
exports.recipe_delete = (req, res) => {
  Recipe.findOneAndDelete(req.params.id)
    .then((recipe) => res.json("Recipe Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
};
