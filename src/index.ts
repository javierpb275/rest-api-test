import App from "./app";
import { MongoDB } from "./db";

class Server {
  private app: App;

  constructor() {
    this.app = new App();
    MongoDB.mongooseConnect();
  }

  public start(): void {
    this.app.start();
  }
}

const server = new Server();
server.start();
