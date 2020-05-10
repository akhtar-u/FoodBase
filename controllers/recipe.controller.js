const Recipe = require('../models/recipe.model');

// add a new recipe
exports.recipe_add = (req, res) => {
  let recipe = new Recipe({
    userid: req.body.userid,
    recipename: req.body.recipename,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    nickname: req.body.nickname,
    public: req.body.public,
  });

  recipe
    .save()
    .then(() => res.redirect('/dashboard'))
    .catch((err) => res.status(400).json('Error: ' + err));
};

// fetch recipes by userid
exports.recipes_list = (req, res) => {
  Recipe.find({ userid: req.params.id })
    .then((recipe) => res.json(recipe))
    .catch((err) => res.status(400).json('Error: ' + err));
};

// fetch all recipes that are public
exports.recipe_public = (req, res) => {
  Recipe.find({ public: req.params.id }, 'image recipename public -_id')
    .then((recipe) => res.json(recipe))
    .catch((err) => res.status(400).json('Error: ' + err));
};

// fetch the recipe that is being clicked on /browse
exports.recipe_pubrec = (req, res) => {
  Recipe.findOne(
    { image: { $regex: req.params.id, $options: 'i' } },
    'image recipename createdAt instructions ingredients nickname -_id'
  )
    .then((recipe) => res.json(recipe))
    .catch((err) => res.status(400).json('Error: ' + err));
};

// fetch recipe by id
exports.recipe_view = (req, res) => {
  Recipe.findById(req.params.id)
    .then((recipe) => res.json(recipe))
    .catch((err) => res.status(400).json('Error: ' + err));
};

// update a recipe
exports.recipe_update = (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then((recipe) => res.redirect(303, '/dashboard'))
    .catch((err) => res.status(400).json('Error: ' + err));
};

// delete a recipe
exports.recipe_delete = (req, res) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then((recipe) => res.json('Recipe Deleted'))
    .catch((err) => res.status(400).json('Error: ' + err));
};
