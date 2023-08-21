export function handleData(data: string): string[];

export function handleData(data: number): string;

export function handleData(x: any): any { 
  if (typeof x === "string") {
    return x.split("");
  } else {
    return x
      .toString()
      .split("")
      .join("_");
  }
}
