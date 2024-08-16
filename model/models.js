const mongoose = require("../db/Collections");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  reward_points: { type: Number, default: 0 },
  password: { type: String, required: true },
  profile_picture: {
    type: String,
    default:
      "https://gravatar.com/avatar/14f0c1272b4b2cc4ce5c969725cc71a0?s=200&d=mp&r=x",
  },
  created_at: { type: Date, default: Date.now },
  plant_count: { type: Number },
  plants: [{ type: mongoose.Schema.Types.ObjectId, ref: "plants" }],
});
const usersModel = mongoose.model("user", userSchema);

const plantSchema = new mongoose.Schema(
  {
    plant_name: { type: String },
    plant_origin: { type: String },
    plant_type: { type: String },
    plant_cycle: { type: String },
    plant_description: { type: String },
    sunlight: { type: String },
    water: { type: String },
    date_added: { type: Date, default: Date.now },
  },

  { strict: false }
);

const plantModel = mongoose.model("plants", plantSchema);

module.exports = { usersModel, plantModel };
