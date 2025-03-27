import mongoose, {Schema} from "mongoose";
import options from "./index.js";    
const streaksSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    }
   
}, options)

const Streak = mongoose.model("Streak", streaksSchema)
export default Streak