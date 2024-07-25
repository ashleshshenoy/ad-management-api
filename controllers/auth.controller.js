const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


async function register(req, res){
	const { email, password } = req.body;
	if(!email || !password) return res.status(400).json({ error : "Invalid request, Required fields are missing."});
	try{
		const userExists = await User.findOne({ email });
		if(userExists) return res.status(400).json({ error : "Invalid request, User email already in use. Please try to login or use different email"});
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ email, password: hashedPassword });
		const token = jwt.sign({ id: user._id, role: user.role }, process.env.APP_SECRET_KEY);
		res.status(200).json({ token });
	} catch {
		res.status(500).json({ error : "Internal server error"});
	}
}

async function login(req, res) {
	const { email, password } = req.body;
	if(!email || !password) return res.status(400).json({ error : "Invalid request, Required fields are missing."});
	try{
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Invalid email or password" });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });
		const token = jwt.sign({ id: user._id, role: user.role }, process.env.APP_SECRET_KEY );
		res.status(200).json({ token });
	} catch {
		res.status(500).json({ error : "Internal server error" });
	}
}

module.exports = {
	register,
	login
};
