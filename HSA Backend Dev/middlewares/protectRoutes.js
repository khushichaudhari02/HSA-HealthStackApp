
function protectRoutes(req,res,next){
// extract the role from the req.header and authorization header using jwt and
// then use the extracted role and compare the role to the authorization role.
//if not then throw error with not authorized message.

if(req.baseUrl.startsWith('/api/superAdmin') && req.userRole!='superAdmin'){
   const error = new Error('Not authorized.');
    error.statuCode = 403;
    throw error;
}
if(req.baseUrl.startsWith('/api/admin') && req.userRole!= 'admin'){
   const error = new Error('Not authorized.');
   error.statuCode = 403;
   throw error;
 }
 if(req.baseUrl.startsWith('/api/doctor') && req.userRole !='doctor'){
   console.log('in if block')
   const error = new Error('Not authorized.');
   error.statuCode = 403;
   throw error;
 }
 if(req.baseUrl.startsWith('/api/lab') && req.userRole !='labWorker'){
   const error = new Error('Not authorized.');
   error.statuCode = 403;
   throw error;
 }
next();
}

module.exports=protectRoutes;


