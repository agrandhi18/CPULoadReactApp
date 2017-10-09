import React from 'react';
import ReactSpeedometer from "react-d3-speedometer";
import LineChart from "./components/LineChart.jsx";
import { chartDataSet, chartOptions } from "./helpers/DataHelper";
import {
    startServerHelperFunc,
    stopServerHelperFunc,
    clearGetInfoFunc,
    changePerCoreFunc
} from "./helpers/serviceHelpers.js";

export default class App extends React.Component {
    constructor() {
        super();
        this.didServerStart = false;
        this.state = {
            totalAverage: 0,
            chartData: chartDataSet,
            perCore: false,
            isGraphStateChanged: false
        };
        this.startServer = startServerHelperFunc.bind(null, this);
        this.stopServer = stopServerHelperFunc.bind(null, this);
        this.changePerCore = changePerCoreFunc.bind(null, this);
    }

    componentWillUnmount() {
        clearGetInfoFunc();
    }

    render() {
        return (
            <div className="fullHeight">
                <h2>CPU Load Dashboard </h2>
                <div className= "configParentDiv">
                    <div>
                        <ReactSpeedometer
                            maxValue={100}
                            value={this.state.totalAverage}
                            needleColor="#E6550D"
                            startColor="#74C476"
                            segments={10}
                            endColor= "#FF6384"
                            width= {300}
                            height= {180}
                        />
                    </div>
                    <div className= "configDiv">
                        <button onClick={this.startServer} disabled= {this.didServerStart} className= "btn btn-start">Start</button>
                        <button onClick={this.stopServer} className= "btn btn-stop" disabled= {!this.didServerStart}>Pause</button>
                        <button onClick={this.changePerCore} className= "btn btn-toggle">{this.state.perCore ? "Click For Accumulated Load" : "Click For Per Core Load"}</button>
                    </div>
                </div>
                <LineChart
                    data={chartDataSet}
                    options={chartOptions}
                />
            </div>
        )
    }
}







