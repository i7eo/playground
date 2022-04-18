import cheerio from "cheerio";
import fs from "fs";
import { Analyzer } from "./crowller"

interface HotRecord {
  content: string;
  idx: number;
}

interface HotRecords {
  time: number;
  data: HotRecord[];
}

interface FileContent {
  [key: number]: HotRecord[];
}

export default class BaiduAnalyzer implements Analyzer {
  private static instance: BaiduAnalyzer

  private constructor() {}

  static getInstance() {
    if(!this.instance) this.instance = new BaiduAnalyzer()
    return this.instance
  }

  private getJsonInfo(content: string): HotRecords {
    const $ = cheerio.load(content);
    const hotList = $("#hotsearch-content-wrapper li");
    const hotRecords: HotRecord[] = [];
    hotList.map((idx, hot) => {
      const hotContent = $(hot).find(".title-content-title").text();
      hotRecords.push({
        idx,
        content: hotContent,
      });
    });
    return {
      time: new Date().getTime(),
      data: hotRecords,
    };
  }

  private generateJson(record: HotRecords, filePath: string) {
    let fileContent: FileContent = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    fileContent[record.time] = record.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const record = this.getJsonInfo(html);
    const json = this.generateJson(record, filePath);
    return JSON.stringify(json);
  }
}
