function isAuthorized(role) {
	return (req, res, next) => {
		if (req.user && req.user.role === role) {
			next(); 
		} else {
			res.status(403).send("Forbidden request, Not authorised to make this request"); 
		}
	};
}
  
module.exports = {
	isAuthorized
};
  