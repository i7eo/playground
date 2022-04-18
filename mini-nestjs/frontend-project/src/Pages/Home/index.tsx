import { Button, Icon, message } from "antd";
import Axios from "axios";
import EchartsReact from "echarts-for-react";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./style.css";
import dayjs from "dayjs"

// const Home: () => JSX.Element = () => {
// const Home: React.FC = () => {
//   return (
// <section className="page-home">
//   <div className="home">
//     <Button type="primary">爬取</Button>
//     <Button type="primary">展示</Button>
//     <Button type="link">退出</Button>
//   </div>
// </section>
//   );
// };

// export default Home;

// interface IState {
//   isLogin: boolean
// }
// export default class Home extends Component<{}, IState> {

  interface ISeries {
    name: string;
    type: string;
    data: string[];
  }

interface HotRecord {
  idx: number;
  content: string;
}

interface IState {
  isLogin: boolean;
  loading: boolean;
  data: {
    [key: string]: HotRecord[];
  };
}

export default class Home extends Component {
  // constructor(props: {}) {
  //   super(props)
  //   this.state = {
  //     isLogin: true
  //   }
  // }

  state: IState = {
    isLogin: true,
    loading: true,
    data: {},
  };

  async componentDidMount() {
    const {
      data: { data: isLogin, msg },
    } = await Axios.get("/api/isLogin");
    if (!isLogin) message.warning(msg);
    // this.setState({
    //   isLogin,
    //   loading: false,
    // });

    const {
      data: { data: crowllerResult },
    } = await Axios.get("/api/data/show");

    this.setState({
      isLogin,
      loading: false,
      data: crowllerResult,
    });
  }

  handleLogout = async () => {
    const {
      data: { data: isLogoutSuccess },
    } = await Axios.get("/api/logout");
    if (isLogoutSuccess) {
      this.setState({
        isLogin: false,
      });
    }
  };

  handleCrowller = async () => {
    const {
      data: { data, msg },
    } = await Axios.get("/api/data/crowller");
    if (data) {
      message.success(msg);
    } else {
      message.error("抓取失败");
    }
  };

  handleShow = async () => {
    const {
      data: { data, msg },
    } = await Axios.get("/api/data/show");
    if (data) {
      // message.success(msg)
    } else {
      // message.error(msg)
    }
  };

  handleEchartsReactOptions: () => echarts.EChartOption = () => {
    const { data } = this.state
    
    const legendData: string[] = [];
    const xAxisData: string[] = [];
    const series: ISeries[] = [];
    for(let [timestamp, hotRecords] of Object.entries(data)) {
      xAxisData.push(dayjs(timestamp).format("MM-DD HH:mm"))
      hotRecords.forEach(hotRecord => {
        if(!legendData.includes(`${hotRecord.idx}`)) {
          legendData.push(`${hotRecord.idx}`)
          const seriesItem: ISeries = {
            name: `${hotRecord.idx}`,
            type: "line",
            data: []
          };
          series.push(seriesItem)
        }else{
          const target = series.find(item => item.name === `${hotRecord.idx}`)
          target?.data.push(hotRecord.content)
        }

      })
    }

    return {
      title: {
        text: "百度热词",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: legendData,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: {
        type: "value",
      },
      series
    };
  };

  render() {
    const { isLogin, loading } = this.state;
    if (isLogin) {
      return !loading ? (
        <section className="page-home">
          <div className="home">
            <div className="home-btns">
              <Button type="primary" onClick={this.handleCrowller}>
                爬取
              </Button>
              <Button type="primary" onClick={this.handleShow}>
                展示
              </Button>
              <Button type="link" onClick={this.handleLogout}>
                退出
              </Button>
            </div>
            <div className="home-data">
              <EchartsReact option={this.handleEchartsReactOptions()} />
            </div>
          </div>
        </section>
      ) : (
        <Icon type="loading" />
      );
    }
    return <Redirect to="/login" />;
  }
}
