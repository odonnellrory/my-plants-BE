const mongoose = require("../db/collections");

const regex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [regex, "Incorrect email format"],
  },
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
    nickname: { type: String, default: null },
    common_name: { type: String, required: true },
    plant_origin: { type: String, default: null },
    scientific_name: { type: Array },
    type: { type: String },
    cycle: { type: String },
    description: { type: String },
    sunlight: { type: String },
    watering: { type: String },
    date_added: { type: Date, default: Date.now },
    depth_of_water: { type: String },
    last_watered: { type: Date, default: Date.now },
    next_watering: { type: Date },
    watering_general_benchmark: { type: Object },
    watering_period: { type: String },
    volume_water_requirement: { type: Object },
    pruning_month: { type: Array },
    pruning_count: { type: Object },
    maintenance: { type: String },
    growth_rate: { type: String },
    img_ur: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/houseplant-brown-pot-nature-icon_24877-82849.jpg",
    },
  },

  { strict: false }
);

const plantModel = mongoose.model("plants", plantSchema);

module.exports = { usersModel, plantModel };
