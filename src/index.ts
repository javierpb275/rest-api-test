import express, { Application, Router } from "express";

const app: Application = express();
const router: Router = Router();

//settings
app.set("port", process.env.PORT || 4000);

//middlewares
app.use(express.json());

//router
router.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

//routes
app.use("/api/hello", router);


app.listen(app.get("port"), () => {
  console.log(`Server is up on port ${app.get("port")}`);
});
