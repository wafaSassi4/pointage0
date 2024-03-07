import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import Connect_DB from "./config/connect.js";
import { fileURLToPath } from "url";
import path from "path";
import userRouter from "./router/userRouter.js";

const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

/* Routes*/
app.get("/", (req, res) => {
    res.send("Welcome, In Our Server !");
});
app.use('/user', userRouter);
  
  // Database connection
  Connect_DB().then((db) => {
    if (db) {
      // Start the server
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    } else {
      console.log("Invalid db connexion...");
    }
  });