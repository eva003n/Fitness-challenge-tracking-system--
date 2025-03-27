import mongoose, { Schema } from "mongoose";
import options from "./index.js";
import bcrypt from "bcryptjs";
import logger from "../logger/logger.winston.js";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";



const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true, //unique single field index
      minlength: [5, "Email lenth must be at least 5 charaters long"],
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      trim: true,
      select: false, //hide password from queries
    },
    avatar: {
      imageUrl: {
        type: String,
        default:
          "https://res.cloudinary.com/dz15elupq/image/upload/v1739342716/fit-track-images/file_kvu2jr.jpg",
      },
      imageId: {
        type: String,
        default: "fit-track-images/file_kvu2jr",
      },
    },

    weight: {
      type: Number,
      min: 0,
      default: 0,
    },
    streaks: {
    best: {
        type: Number,
        default: 0
    },
    current: {
        type: Number,
        default: 0
    },
    lastUpdate: {
      type: Date,
      default: Date.now
    }
    },
    bio: {
      type: String,
      default: "Add a bio ...",
    },
    socialsLinks: {
      Twitter: {
        type: String,
        trim: true,
      },
      Facebook: {
        type: String,
        trim: true,
      },
      Instagram: {
        type: String,
        trim: true,
      },
      Tiktok: {
        type: String,
        trim: true,
      },
    },
    //manage roles
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true
  },
    //array of challenge documents
    challenges: {
      type: [Schema.Types.ObjectId],
      ref:"Challenge"
    },
    //ids of various squads the user belongs to
    squads: [
      {
        type: [Schema.ObjectId],
        ref: "Squad",
      },
    ],
    notifications: [
      {
        type: [Schema.Types.ObjectId],
        ref: "Notification",
      },
    ],
    refreshToken: {
      type: String,
      select: false,
    },
    
  },
  options
);
//custom hooks

userSchema.plugin(aggregatePaginate);

//before saving a creating  new user hash password
userSchema.pre("save", async function (next) {
  //checks if the provided path is modified then returns true  else if no argument is passed returns true for all paths
  if (!this.isModified("password")) {
    //passowrd not modified
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//custom methods
//instance methods only work with a model instanve
userSchema.methods.isMatchingPassword = async function (password) {
  return bcrypt.compare(password, this.password); //userpassword, hashedpassword
};
//set users refresh token
userSchema.methods.setRefreshToken = async function (token) {
  this.refreshToken = token;
};

//custom method to update users current and longest streak
userSchema.methods.updateStreaks = async function (currentStreak, bestStreak) {
  this.currentStreak = currentStreak
  this.bestStreak = bestStreak  
}
//statics
userSchema.statics.findUser = async function (userId) {
  //this refers to User model
  return this.findById(userId);
};
// userSchema.statics.findUserAndAddStreaks = async function (
//   userId,
//   streaksCount
// ) {
//   //this refers to User model
//   this.findById(userId).streaks = streaksCount;
// };

const User = mongoose.model("User", userSchema);
//Avoid automatic  collection and index creation in production
// if (process.env.NODE_ENV === "production") {
//   await User.createCollection();
//   await User.createIndexes();
// }
User.on("index", (error) => {
  if (error) logger.error(`Error building indexes at user model`);
  logger.info("Successful index building at user model");
});

export default User;
