const assignmentSchema=require("../models/assignment")

async function createAssign(req,res){
    const {title, skills, StackBlitzUrl, userId}=req.body;
    try{
        const projRegi= new assignmentSchema({
            title,
            skills,
            StackBlitzUrl,
            userId
        });
        const ProjectDetail=await projRegi.save();
        const projDetails=await assignmentSchema.find({});
        return res.status(200).json(projDetails);
    }
    catch(err){
        return res.status(400).json({message:"Error at Adding Eployee Data", error: err.message });
    }
}

async function deleteAssign(req,res){
    try{
        const {id}=req.query;
        console.log(id);
        const employee=await assignmentSchema.deleteOne({_id:id});
        const projDetails=await assignmentSchema.find({});
        return res.status(200).json(projDetails);
    }
    catch(err){
        return res.status(400).status({message:"Getting error while deleting Emp",error:err.message});
    }
}

async function updateAssign(req, res) {
    const { title, skills, StackBlitzUrl, userId } = req.body; 
    try {
        const { id } = req.params;
        console.log("I Got the Id",id);
        const existingAssignment = await assignmentSchema.findById(id);
        if (!existingAssignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Update only the provided fields
        const updatedAssignment = await assignmentSchema.findByIdAndUpdate(
            id,
            {
                ...(title !== undefined && { title }),
                ...(skills !== undefined && { skills }),
                ...(StackBlitzUrl !== undefined && { StackBlitzUrl })
                },
            { new: true }
        );
        const projDetails=await assignmentSchema.find({});

        return res.status(200).json(projDetails);
    } catch (err) {
        return res.status(400).json({ message: "Error updating assignment", error: err.message });
    }
}



async function readAssign(req,res){
    try{
        const assignmentDetail=await assignmentSchema.find({});
        return res.status(200).json(assignmentDetail);
    }
    catch(err){
        return res.status(400).json({message:"Error at Adding Eployee Data", error: err.message });
    }
}

async function readProject(req,res){
    try {
        let assignmentDetail;
        if (req.query.id) {
          assignmentDetail = await assignmentSchema.findById(req.query.id);
          if (!assignmentDetail) {
            return res.status(404).json({ message: "Assignment not found" });
          }
        }
        return res.status(200).json(assignmentDetail);
      } catch (err) {
        return res.status(400).json({
          message: "Error retrieving assignment data",
          error: err.message,
        });
      }
}



module.exports={
    createAssign,
    deleteAssign,
    updateAssign,
    readAssign,
    readProject
}