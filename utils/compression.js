const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const CRF_VALUE = 18;   
const { videoFormats} = require("./formats");

const compressFile = (inputPath, outputPath) => {
	return new Promise((resolve, reject) => {
		const ext = path.extname(inputPath).toLowerCase();
		if (videoFormats.includes(ext)) {
			console.log("compressing");
			ffmpeg(inputPath)
				.outputOptions(`-crf ${CRF_VALUE}`)  
				.save(outputPath)
				.on("end", () => resolve(outputPath))
				.on("error", (err) => reject(err));
		} 
		else resolve(outputPath);
	});
};


module.exports = {
	compressFile
};