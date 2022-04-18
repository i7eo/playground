interface IResponse {
  success: boolean;
  msg?: string;
  data: any;
}

export const getResponseData = (success: boolean, data: any, msg?: string): IResponse => {
  return {
    success: !!success,
    msg,
    data
  }
}