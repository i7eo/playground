import { RequestHandler } from "express";
import "reflect-metadata";
import { CrowllerController, LoginController } from "../controller";

type Controllers = CrowllerController | LoginController;

// export function middleware(middleware: RequestHandler | RequestHandler[]) { // 直接传入数组的方式，中间件顺序与数组索引顺序一致
export function middleware(middleware: RequestHandler) {
  return function (target: Controllers, key: string) {
    // 这种写法会保证中间件执行顺序是由下到上的正常顺序
    const prevMiddleware: RequestHandler[] =
      Reflect.getMetadata("middleware", target, key) || [];
    const middlewares: RequestHandler[] = [...prevMiddleware, middleware];
    Reflect.defineMetadata("middleware", middlewares, target, key);
  };
}
