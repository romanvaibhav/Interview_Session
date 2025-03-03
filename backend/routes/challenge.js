const express=require("express");
const router=express.Router();
const {addChallenge, deleteChallenge, readAChallengen}=require("../controllers/challenge");


router.post("/add",addChallenge);
router.delete("/delete",deleteChallenge);
router.get("/read",readAChallengen);  
// router.get("/proj",readProject); 

module.exports=router;