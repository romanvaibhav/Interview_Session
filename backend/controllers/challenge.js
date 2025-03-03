const challengeDetailSchema=require("../models/challenge");

async function addChallenge(req, res) {
    const { challenges, userId, candidateId } = req.body;

    try {
        // Find if a document with the same userId and candidateId exists
        let challengeRegi = await challengeDetailSchema.findOne({ candidateId });

        if (!challengeRegi) {
            // If no document exists, create a new one
            challengeRegi = new challengeDetailSchema({
                challenges: challenges.map(({ url, title }) => ({ url, title })),  // Store both url and title
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

module.exports={
    readAChallengen,
    deleteChallenge,
    addChallenge
}