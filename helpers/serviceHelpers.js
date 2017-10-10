import moment from "moment";
import { dataSetRef, getRandomColor, colorList } from "./DataHelper";

let getInfoIntervalFunc = null;
let chartDataLabels = [];
let chartDataValues = [];

/**
 * Generates an empty data set for chart
 * @param {object} appRef The app component reference
 * @param {object} response The response from the restful api with system load response
 */
const generateEmptyChartDataSet = (appRef, response) => {
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
        });
    }
};

/**
 * Updates the chart data with the system load data from the server response
 * @param {object} appRef The app component reference
 * @param {object} response The response from the restful api with system load response
 */
const updateChartDataSet = (appRef, response) => {
    // Add new label by removing the oldest label from the chartDataLables
    chartDataLabels.pop();
    chartDataLabels.unshift(moment().format("mm::ss"));
    // Add current system load to the data set based on the perCore property
    // We should remove the oldest system load data and add new system load at the first. 
    if (appRef.state.perCore) {
        chartDataValues.map((dataSet, i) => {
            dataSet.data.pop();
            dataSet.data.unshift(response.corePercentages[i]);
        });
    } else {
        chartDataValues[0].data.pop();
        chartDataValues[0].data.unshift(response.totalPercentage);
    }
};

/**
 * Would make script request for localserver getInfo method to get latest system load and update the 
 * chart data values
 * @param {object} appRef App reference object 
 */
const getCurrentSystemData = (appRef) => {
    const getInfoUrl = "http://localhost:1337/getInfo";
    fetch(getInfoUrl, { method: "GET", headers: { Accept: "application/json" } }).then((response) => {
        response.json().then(response => {
            // If the graph is changed from core level to aggregate should reset the graph
            if (appRef.state.isGraphStateChanged === true) {
                appRef.setState({ isGraphStateChanged: false });
                generateEmptyChartDataSet(appRef, response);
            } else {
                chartDataLabels = appRef.state.chartData.labels;
                chartDataValues = appRef.state.chartData.datasets;
            }
            updateChartDataSet(appRef, response);
            // Add chart dataset values to the state variable to update the chart 
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
    fetch(url, { method: "GET", headers: { Accept: "application/json" } }).then((response) => {
        response.json().then(response => {
            generateEmptyChartDataSet(appRef, response);
            updateChartDataSet(appRef, response);
            appRef.state.chartData.labels = chartDataLabels;
            appRef.state.chartData.datasets = chartDataValues;
            appRef.setState({
                data: t.toString(),
                totalAverage: parseFloat(response.totalPercentage),
                chartData: appRef.state.chartData
            });
            // start the getCurrentsystemData setInterval function to get system load for every one sec
            setTimeout(() => {
                getInfoIntervalFunc = setInterval(getCurrentSystemData.bind(null, appRef), 1000);
            }, 1000);

        });
    }).catch(error => console.log(error));
    appRef.didServerStart = true;
};

/**
 * Would make script request for localserver stop to kill the the fork(child process) which calculates
 * system load
 * @param {object} appRef App reference object 
 */
export const stopServerHelperFunc = (appRef) => {
    const url = "http://localhost:1337/stop";
    fetch(url, { method: "GET", headers: { Accept: "application/json" } }).then((response) => {
        response.json().then(response => {
            console.log(response);
        });
    }).catch(error => console.log(error));
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
