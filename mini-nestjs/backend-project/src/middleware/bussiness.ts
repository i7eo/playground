import { NextFunction, Request, Response } from "express";
import { getResponseData } from "../core/utils";

export const checkLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("test checklogin");
  const isLogin = !!req.session?.login;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(false, null, "请先登录"));
    // res.send("please login");
  }
};

export const log = (req: Request, res: Response, next: NextFunction): void => {
  console.log("test log");
  next();
};
