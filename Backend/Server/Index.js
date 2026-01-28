import express from "express";
import GitRouter from "../Router/GitRouter.js";
const app = express();

app.use(express.json());

//NOw our routing setup would come here;
app.use("/api", GitRouter);

app.get("/", (req, res) => {
  res.send("welcome");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
