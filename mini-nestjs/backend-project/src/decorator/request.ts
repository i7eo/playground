import "reflect-metadata";
import { CrowllerController, LoginController } from "../controller"

type Controllers = CrowllerController | LoginController

export enum HttpMethods {
  get = "get",
  post = "post"
}

function requestDecoratorFactory(method: HttpMethods) {
  return function (path: string) {
    return function (target: Controllers, key: string) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", method, target, key);
    };
  };
}

export const get = requestDecoratorFactory(HttpMethods.get);
export const post = requestDecoratorFactory(HttpMethods.post);
