const mongoose=require("mongoose")


const challengeSchema = new mongoose.Schema({
    challenges: [{
        id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each challenge
        url: { type: String },
        title:{type:String}  // URL of the challenge
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewSchema",
    }
});



const challengeDetailSchema=mongoose.model("challengeSchema",challengeSchema);
module.exports=challengeDetailSchema;