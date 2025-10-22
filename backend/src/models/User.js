import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    farmLocation: {
      type: String,
      default: "",
    },
    farmSize: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    connectedDevices: {
      type: Number,
      default: 0,
    },
    farmingType: {
      type: String,
      default: "",
    },
    soilType: {
      type: String,
      default: "",
    },
    irrigationType: {
      type: String,
      default: "",
    },
    lastHarvest: {
      type: String,
      default: "",
    },
    cropsGrown: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// hash password before saving user to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// compare password function
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
