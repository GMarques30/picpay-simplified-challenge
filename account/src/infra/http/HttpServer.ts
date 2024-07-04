import express, { Request, Response } from "express";

export interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (err: any) {
        res.status(400).json({
          message: err.message,
        });
      }
    });
  }
  listen(port: number): void {
    this.app.listen(port);
  }
}
