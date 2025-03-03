const InterviewSchema=require("../models/session");
async function createSession(req,res){
    const {score, status, candidateName, interviewerId,time_duration}=req.body;
    try{
        const sessionRegi= new InterviewSchema({
            candidateName,
            interviewerId,
            time_duration,
            status,
            score

        });
        const sessionDetail=await sessionRegi.save();
        const sessionDetails=await InterviewSchema.find({});
        return res.status(200).json(sessionDetails);
    }
    catch(err){
        return res.status(400).json({message:"Error at Creating Session", error: err.message });
    }
}

async function deleteSession(req,res){
    try{
        const {id}=req.query;
        console.log(id);
        const employee=await InterviewSchema.deleteOne({_id:id});
        const sessionDetails=await InterviewSchema.find({});
        return res.status(200).json(sessionDetails);
    }
    catch(err){
        return res.status(400).status({message:"Getting error while deleting session",error:err.message});
    }
}

async function updateSession(req, res) {
    const { candidateName, status, score, time_duration } = req.body; 
    try {
        const { id } = req.query;
        console.log("I Got the Id",id);
        const existingSession = await InterviewSchema.findById(id);
        if (!existingSession) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        // Update only the provided fields
        const updatedAssignment = await InterviewSchema.findByIdAndUpdate(
            id,
            {
                ...(candidateName !== undefined && { candidateName }),
                ...(status !== undefined && { status }),
                ...(score !== undefined && { score }),
                ...(time_duration !== undefined && { time_duration })
                },
            { new: true }
        );
        const sessionDetails=await InterviewSchema.find({});

        return res.status(200).json(sessionDetails);
    } catch (err) {
        return res.status(400).json({ message: "Error updating assignment", error: err.message });
    }
}



async function readSession(req,res){
    try{
        const sessiontDetail=await InterviewSchema.find({});
        return res.status(200).json(sessiontDetail);
    }
    catch(err){
        return res.status(400).json({message:"Error at Adding Eployee Data", error: err.message });
    }
}

async function readSessionProj(req,res){
    try {
        let sessionDetail;
        if (req.query.id) {
          sessionDetail = await InterviewSchema.findById(req.query.id);
          if (!sessionDetail) {
            return res.status(404).json({ message: "Assignment not found" });
          }
        }
        return res.status(200).json(sessionDetail);
      } catch (err) {
        return res.status(400).json({
          message: "Error retrieving assignment data",
          error: err.message,
        });
      }
}



module.exports={
    createSession,
    deleteSession,
    updateSession,
    readSession,
    readSessionProj
}