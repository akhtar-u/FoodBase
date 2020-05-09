const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RecipeSchema = new Schema(
  {
    userid: { type: String, required: true },
    recipename: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    nickname: { type: String, required: true },
    public: { type: Boolean, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Export the model
module.exports = mongoose.model('Recipe', RecipeSchema);
