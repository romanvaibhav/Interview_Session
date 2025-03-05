const challengeDetailSchema=require("../models/challenge");
const mongoose = require("mongoose"); 
async function addChallenge(req, res) {
    const { challenges, userId, candidateId } = req.body;

    try {
        // Find if a document with the same userId and candidateId exists
        let challengeRegi = await challengeDetailSchema.findOne({ candidateId });

        if (!challengeRegi) {
            // If no document exists, create a new one
            challengeRegi = new challengeDetailSchema({
                challenges: challenges.map(({ url, title, score, status }) => ({ url, title, score,status })),  // Store both url and title
                userId,
                candidateId,
            });
        } else {
            // If document exists, add new challenges to the array
            challenges.forEach(({ url, title }) => challengeRegi.challenges.push({ url, title }));
        }

        // Save the updated document
        await challengeRegi.save();

        // Fetch and return the updated challenge details
        return res.status(200).json(challengeRegi);
    } catch (err) {
        return res.status(400).json({ message: "Error at Adding Challenge", error: err.message });
    }
}






async function deleteChallenge(req, res) {
    try {
        const { id, candidateId } = req.query; // Get challenge ID & candidate ID

        if (!id || !candidateId) {
            return res.status(400).json({ message: "Missing challengeId or candidateId" });
        }

        // Find the document & remove the specific challenge from the array
        const updatedChallenge = await challengeDetailSchema.findOneAndUpdate(
            { candidateId },
            { $pull: { challenges: { _id: id } } },  // Remove challenge by ID
            { new: true } // Return the updated document
        );

        if (!updatedChallenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        return res.status(200).json(updatedChallenge);
    } catch (err) {
        return res.status(400).json({ message: "Error deleting challenge", error: err.message });
    }
}


async function readAChallengen(req,res){
    try{
        const {id}=req.query;
        console.log(id);
        const challengeDetail=await challengeDetailSchema.find({candidateId:id});
        console.log("Sending Challenges");
        return res.status(200).json(challengeDetail);
    }
    catch(err){
        return res.status(400).json({message:"Error at Adding Eployee Data", error: err.message });
    }
}

async function getChallengeByChallengeId(req, res){
    const { challengeId } = req.query;
    console.log(challengeId);
  
    try {
      // Using the positional operator to return only the matching challenge element.
      const candidate = await challengeDetailSchema.findOne(
        { 'challenges._id': challengeId },
        { 'challenges.$': 1 }
      );
      console.log(candidate);
      
    //   if (!challengeDetailSchema || !challengeDetailSchema.challenges || challengeDetailSchema.challenges.length === 0) {
    //     return res.status(404).json({ error: 'Challenge not found' });
    //   }
      
      // Return the matched challenge from the challenges array
      return res.status(200).json(candidate);
    } catch (error) {
      console.error('Error retrieving challenge:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  


module.exports={
    readAChallengen,
    deleteChallenge,
    addChallenge,
    getChallengeByChallengeId
}