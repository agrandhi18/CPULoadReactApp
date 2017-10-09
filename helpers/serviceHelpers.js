import moment from "moment";
import { dataSetRef, getRandomColor, colorList } from "./DataHelper";

let getInfoIntervalFunc = null;
let chartDataLabels = [];
let chartDataValues = [];
let corePercentages = [];

/**
 * Would make script request for localserver getInfo method to get latest system load and update the 
 * chart data values
 * @param {object} appRef App reference object 
 */
const getCurrentSystemData = (appRef) => {
    const getInfoUrl = "http://localhost:1337/getInfo";
    fetch(getInfoUrl, { method: 'GET', headers: { Accept: 'application/json' } }).then((response) => {
        response.json().then(response => {
            corePercentages = response.corePercentages || Array(response.totalCores).fill(0);

            // If the graph is changed from core level to aggregate should reset the graph
            if (appRef.state.isGraphStateChanged === true) {
                appRef.setState({ isGraphStateChanged: false })
                chartDataLabels = Array(60).join(".").split(".");
                if (!appRef.state.perCore) {
                    chartDataValues = [Object.assign({}, dataSetRef)];
                    chartDataValues[0].data = Array(60).fill(null);
                } else {
                    chartDataValues = [];
                    for (let i = 0; i < response.totalCores; i++) {
                        chartDataValues.push(Object.assign({}, dataSetRef));
                    }
                    //Change the labes and background colors
                    chartDataValues.forEach((dataSet, i) => {
                        dataSet.backgroundColor = i < 10 ? colorList[i] : getRandomColor();
                        dataSet.borderColor = i < 10 ? colorList[i] : getRandomColor();
                        dataSet.label = `core ${i}`;
                        dataSet.data = Array(60).fill(null);
                        dataSet.data.pop();
                        dataSet.data.unshift(response.corePercentages[i]);
                    })
                }
            } else {
                chartDataLabels = appRef.state.chartData.labels;
                chartDataValues = appRef.state.chartData.datasets;
            }

            chartDataLabels.pop();
            chartDataLabels.unshift(moment().format("m: s"));

            if (appRef.state.perCore) {
                chartDataValues.map((dataSet, i) => {
                    dataSet.data.pop();
                    dataSet.data.unshift(response.corePercentages[i]);
                })
            } else {
                chartDataValues[0].data.pop();
                chartDataValues[0].data.unshift(response.totalPercentage);
            }

            appRef.state.chartData.labels = chartDataLabels;
            appRef.state.chartData.datasets = chartDataValues;
            appRef.setState({
                totalAverage: parseFloat(response.totalPercentage),
            });

        });
    }).catch(error => console.log(error));
};

/**
 * Would make script request for localserver start to start the server to calcuate system load
 * @param {object} appRef App reference object 
 */
export const startServerHelperFunc = (appRef) => {
    var url = "http://localhost:1337/start/1000";
    let t = "";
    fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then((response) => {

        response.json().then(response => {
            // Add label to the chart data
            chartDataLabels = Array(60).join(".").split(".");
            chartDataLabels.pop();
            chartDataLabels.unshift(moment().format("m: s"));
            // Add data value to chart
            chartDataValues = [];
            if (appRef.state.perCore) {
                // create new dataSet for all cores
                for (let i = 0; i < response.totalCores; i++) {
                    chartDataValues.push(Object.assign({}, dataSetRef));
                }
                //Change the labes and background colors
                chartDataValues.forEach((dataSet, i) => {
                    dataSet.backgroundColor = i < 10 ? colorList[i] : getRandomColor();
                    dataSet.borderColor = i < 10 ? colorList[i] : getRandomColor();
                    dataSet.label = `core ${i}`
                    dataSet.data = Array(60).fill(null);
                    dataSet.data.pop();
                    dataSet.data.unshift(response.corePercentages[i]);
                })
            } else {
                chartDataValues.push(Object.assign({}, dataSetRef));
                chartDataValues[0].data = Array(60).fill(null);
                chartDataValues[0].data.pop();
                chartDataValues[0].data.unshift(response.totalPercentage);
            }
            appRef.state.chartData.labels = chartDataLabels;
            appRef.state.chartData.datasets = chartDataValues;
            appRef.setState({
                data: t.toString(),
                totalAverage: parseFloat(response.totalPercentage),
                chartData: appRef.state.chartData
            });

            setTimeout(() => {
                getInfoIntervalFunc = setInterval(getCurrentSystemData.bind(null, appRef), 1000);
            }, 1000);

        });
    }).catch(error => console.log(error));;
    appRef.didServerStart = true;
};

/**
 * Would make script request for localserver stop to kill the the fork(child process) which calculates
 * system load
 * @param {object} appRef App reference object 
 */
export const stopServerHelperFunc = (appRef) => {
    const url = "http://localhost:1337/stop";
    fetch(url, { method: 'GET', headers: { Accept: 'application/json' } }).then((response) => {
        response.json().then(response => {
            console.log(response);
        });
    }).catch(error => console.log(error));;
    clearInterval(getInfoIntervalFunc);
    appRef.setState({ pauseOrResumeServerRef: "Resume system load" });
    appRef.didServerStart = false;
};

/**
 * This handles perCore and accumulation load setState value
 * @param {object} appRef App reference object 
 */
export const changePerCoreFunc = (appRef) => {
    appRef.setState({ perCore: !appRef.state.perCore, isGraphStateChanged: true });
};

/**
 * Would clear the set interval for getInfoIntervalFunc function which updates the chart every 1000ms with
 * latest system values
 * @param {object} appRef App reference object 
 */
export const clearGetInfoFunc = () => {
    clearInterval(getInfoIntervalFunc);
};
