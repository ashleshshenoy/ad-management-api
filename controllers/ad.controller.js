const path = require("path");
const { compressFile } = require("../utils/compression");
const adModel = require("../models/ad.model");
const fs = require("fs");

async function createAd(req, res) {
	try {
		const attributes = req.body.attributes || {};
		const files = req.files;
		if (!files || files.length === 0) {
			return res.status(400).json({ message: "No files uploaded" });
		}
    
		// Map files to compress concurrently
		const compressPromises = files.map(async (file) => {
			const filePath = file.path;
			const outputFilePath = path.join("uploads", `processed-${file.filename}`);
			await compressFile(filePath, outputFilePath);
			fs.unlinkSync(filePath);
			const url = `${process.env.HOST_URL}${process.env.STATIC_PATH}/processed-${file.filename}`;
        
			return {
				filename: file.filename,
				size: file.size,
				url: url,
			};
		
		});

		const filesData = await Promise.all(compressPromises);
		const ad = await adModel.create({
			files: filesData,
			attributes: (typeof attributes == "string") ? JSON.parse(attributes) : attributes,
			user: req.user.id
		});

		res.status(201).json(ad);

	} catch{
		res.status(500).json({ error: "Internal server error" });
	}
}

async function getAds(req, res){
	const page = parseInt(req.query.page) || 1; 
	const limit = parseInt(req.query.limit) || 5;    

	try {
		const ads = await adModel.find({ user: req.user.id })
			.sort({ createdAt: -1 })  
			.skip((page - 1) * limit)
			.limit(limit);
        
		const totalAds = await adModel.countDocuments({ user: req.user.id });

		res.status(200).json({
			ads,
			totalAds,
			totalPages: Math.ceil(totalAds / limit),
			currentPage: page,
		});

	} catch {
		res.status(500).json({ error : "Internal server Error" });
	}
}

async function readAd(req, res){
	try {
		const ad = await adModel.findById(req.params.id);
		if (!ad) return res.status(404).json({ message: "Ad not found" });
		res.status(200).json(ad);
	} catch {
		res.status(500).json({ error : "Internal server Error" });
	}
}

async function updateAttributes(req, res){
	try {
		console.log(req.body);
		const newAttributes  = req.body.attributes || {};
		const ad = await adModel.findById(req.params.id);
		if (!ad) return res.status(404).json({ message: "Ad not found" });
		if(ad.user != req.user.id) return res.status(403).json({ error : "Forbidden request, Not authorised to make this request"});
		let oldAttributes = ad.attributes;
		ad.attributes = { ...oldAttributes, ...newAttributes };
		const updatedAd = await ad.save();
		console.log(updatedAd);
		res.status(200).json(updatedAd);

	} catch{
		res.status(500).json({ error: "Internal server Error" });
	}
}

async function deleteAd(req, res){
	try {
		const ad = await adModel.findByIdAndDelete(req.params.id);
		if (!ad) return res.status(404).json({ message: "Ad not found" });
		if (ad.user != req.user.id) res.status(403).json({ error : "Forbidden request, Not authorised to make this request"});
		for(let file of ad.files){
			fs.unlinkSync(path.join(__dirname, "..", "uploads", `processed-${file.filename}`));   // deletes all files associated with this ad
		}
		res.status(200).json({ message: "Ad deleted successfully" });

	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal server Error" });
	}
}

module.exports = {
	getAds,
	readAd,
	createAd,
	updateAttributes,
	deleteAd
};
