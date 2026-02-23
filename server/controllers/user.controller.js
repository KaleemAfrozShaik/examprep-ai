export function getCurrentUser(req,res){
  res.status(200).json({success:true,user:req.user});
  return;
}