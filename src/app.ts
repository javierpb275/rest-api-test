import cors from "cors";
import express, { Application } from "express";
import { CampaignRouter } from "./features/campaign";
import { UserRouter } from "./features/user/routers";

class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.middlewares();
    this.routes();
  }

  private config(): void {
    this.app.set("port", process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.use("/api/users", UserRouter);
    this.app.use("/api/campaigns", CampaignRouter);
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(`Server is up on port ${this.app.get("port")}`);
    });
  }
}

export default App;
