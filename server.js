const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const adRoutes = require("./routes/ad.router");
const authRoutes = require("./routes/auth.router");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("dotenv").config({ path : path.join(__dirname, ".env")});
const app = express();


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("hello world")); //health check

app.use(process.env.STATIC_PATH,express.static(path.join(__dirname, "uploads")));
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/ad", adRoutes);
app.use("/api/auth/", authRoutes);

mongoose.connect(process.env.MONGO_URL)
	.then(() => console.log("Connected to the db"))
	.catch((error) => console.log("Error connecting to MongoDB", error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});