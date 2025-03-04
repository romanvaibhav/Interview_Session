const express=require("express");
const router=express.Router();
const {addChallenge, deleteChallenge, readAChallengen, getChallengeByChallengeId}=require("../controllers/challenge");


router.post("/add",addChallenge);
router.delete("/delete",deleteChallenge);
router.get("/read",readAChallengen);  
router.get("/readone",getChallengeByChallengeId);
// router.get("/proj",readProject); 

module.exports=router;