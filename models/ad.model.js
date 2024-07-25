const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
	files: [
		{
			filename: {
				type: String,
				required: true
			},
			size: {
				type: Number,
				required: true
			},
			url : {
				type : String,
				required : true
			}
		}
	],
	attributes: {
		type: mongoose.Schema.Types.Mixed,
		default: {},
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
}, { timestamps: true, minimize : false });

module.exports = mongoose.model("Ad", adSchema);
