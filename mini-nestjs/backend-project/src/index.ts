import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express, { NextFunction, Request, Response } from "express";
// import router from "./router";
import "./controller/Login"
import "./controller/Crowller"
import { router } from "./router"

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use((req: Request, res: Response, next: NextFunction) => {
  // 自定义中间件时，要往req、res追加属性，此时需要自己做与express同名的d文件，让ts自动合并（类型融合）
  req.username = "i7eo";
  next();
});
app.use(
  cookieSession({
    name: "session",
    keys: ["i7eo"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(router);

app.listen(4000, () => {
  console.log("Serve is running. port is 4000");
});
