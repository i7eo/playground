import { Request, Response } from "express";
import { getResponseData } from "../core/utils";
import { controller, get, post } from "../decorator";

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller("/")
export class LoginController {
  @post("/api/login")
  login(req: RequestWithBody, res: Response): void {
    const { password } = req.body;
    const isLogin = !!req.session?.login;
    if (isLogin) {
      // res.send("logined");
      res.json(getResponseData(true, true, "已登陆"));
    } else {
      if (password === "123" && req.session) {
        console.log(password);
        req.session.login = true;
        // res.send("login success!");
        res.json(getResponseData(true, true, "登陆成功"));
      } else {
        // res.send(`login failed!`);
        res.json(getResponseData(false, false, "登陆失败"));
      }
    }
  }

  @get("/api/logout")
  logout(req: RequestWithBody, res: Response): void {
    if (req.session) {
      req.session.login = undefined;
    }
    // res.redirect("/");
    res.json(getResponseData(true, true, ""));
  }

  @get("/api/isLogin")
  isLogin(req: RequestWithBody, res: Response): void {
    const isLogin = !!req.session?.login;
    if (isLogin) {
      res.json(getResponseData(true, true, "已登陆"));
    } else {
      res.json(getResponseData(false, false, "未登陆"));
    }
  }

  @get("/")
  home(req: RequestWithBody, res: Response): void {
    const isLogin = !!req.session?.login;
    if (isLogin) {
      res.send(
        `
      <html>
        <body>
          <a href="/data/crowller">crowller</a>
          <a href="/data/show">show</a>
          <a href="/logout">quit</a>
        </body>
      </html>
      `
      );
    } else {
      res.send(
        `
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password" />
            <button> 提交 </button>
          </form>
        </body>
      </html>
      `
      );
    }
  }
}
