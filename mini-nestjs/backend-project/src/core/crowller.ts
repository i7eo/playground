// import cheerio from "cheerio";
import fs from "fs";
import path from "path";
import superagent from "superagent";
// import BaiduAnalyzer from "./baiduAnalyzer"

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

const FILE_NAME = "hotRecords";
const FILE_EXT = "json";

export default class Crowller {
  private filePath = path.resolve(
    __dirname,
    `../../data/${FILE_NAME}.${FILE_EXT}`
  );

  private async getRawHtml() {
    const { text = "" } = await superagent.get(this.url);
    return text;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  private async initCrowllerData() {
    const html = await this.getRawHtml();
    if (!html) {
      console.warn("no raw data");
      return;
    }

    const content = this.baiduAnalyzer.analyze(html, this.filePath)
    this.writeFile(content);
  }

  constructor(private url: string, private baiduAnalyzer: Analyzer) {
    this.initCrowllerData();
  }
}

// const baiduAnalyzer = BaiduAnalyzer.getInstance()
// const url = `http://www.baidu.com`;
// new Crowller(url, baiduAnalyzer);
