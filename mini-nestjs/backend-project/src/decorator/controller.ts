import { RequestHandler } from "express";
import "reflect-metadata";
import { router } from "../router";
import { HttpMethods } from "./request";

export function controller(root: string) {
  return function (target: new (...args: any[]) => any) {
    // 详情见readme，为什么不用for in或object.keys见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
    Reflect.ownKeys(target.prototype).forEach((key) => {
      // console.log(Reflect.getMetadata("path", target.prototype, key))
      const path: string = Reflect.getMetadata("path", target.prototype, key);
      const method: HttpMethods = Reflect.getMetadata(
        "method",
        target.prototype,
        key
      );
      const handler = target.prototype[key];
      const middleware: RequestHandler[] = Reflect.getMetadata(
        "middleware",
        target.prototype,
        key
      );
      const fullPath = root === "/" ? path : `${root}${path}`;
      if (fullPath && Reflect.has(router, method) && handler) {
        if (middleware) {
          router[method](fullPath, ...middleware, handler);
        } else {
          router[method](fullPath, handler);
        }
      }
    });
  };
}
