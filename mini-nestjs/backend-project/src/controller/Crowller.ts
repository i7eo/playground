import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Analyzer from "../core/Analyzer";
import Crowller from "../core/crowller";
import { getResponseData } from "../core/utils";
import { checkLogin, log } from "../middleware/bussiness";
import { controller, get, middleware } from "../decorator";

interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined;
  };
}

@controller("/api/data")
export class CrowllerController {
  @get("/crowller")
  @middleware(checkLogin)
  crowller(req: RequestWithBody, res: Response): void {
    const analyzer = Analyzer.getInstance();
    const url = `http://www.baidu.com`;
    new Crowller(url, analyzer);
    // res.send("success!");
    res.json(getResponseData(true, true, "抓取成功"));
  }

  @get("/show")
  // @middleware([checkLogin, log])
  @middleware(checkLogin)
  @middleware(log)
  show(req: RequestWithBody, res: Response): void {
    try {
      const position = path.resolve(__dirname, "../../data/hotRecords.json")
      const result = fs.readFileSync(position, "utf-8");
      // res.json(JSON.parse(result));
      res.json(getResponseData(true, JSON.parse(result)));
    } catch (e) {
      // res.send("data not found");
      res.json(getResponseData(false, false, "暂无数据"));
    }
  }
}
