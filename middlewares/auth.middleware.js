const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const token = req.header("Authorization") && req.header("Authorization").replace("Bearer ", "");
	if (!token) return res.status(401).json({ error: "Authentication failed, No Authentication token provided." });
	try {
		const decoded = jwt.verify(token, process.env.APP_SECRET_KEY);
		req.user = decoded;
		next();
	}catch{
		res.status(401).json({ error : "Authentication failed, Invalid Authentication token provided" });
	}
};

module.exports = {
	auth
};
