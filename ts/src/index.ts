import { handleData } from './function-overload'

handleData("abc").join("_");
handleData(123)
// handleData(false); // error 类型"boolean"的参数不能赋给类型"number"的参数。
