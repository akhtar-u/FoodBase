const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let RecipeSchema = new Schema(
  {
    userid: { type: String, required: true },
    recipename: { type: String, required: true },
    image: { data: Buffer, contentType: String },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    public: { type: Boolean, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Export the model
module.exports = mongoose.model('Recipe', RecipeSchema);
