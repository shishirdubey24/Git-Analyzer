import express from "express";
import cors from "cors"; // <--- 1. Import cors
import GitRouter from "../Router/GitRouter.js";

const app = express();

// --- 2. Add CORS Middleware ---
app.use(cors());

app.use(express.json());

// Routing setup
app.use("/api", GitRouter);

app.get("/", (req, res) => {
  res.send("welcome");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
