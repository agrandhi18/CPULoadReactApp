/**
 * Generates random color which can be used duing "per core level" view of the chart
 */
export const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

/**
 * List of colors which can be used duing "per core level" view of the chart, if the cores
 * are more than 10, system uses "getRandomColor" function to generate color
 */
export const colorList = ["#F9A1B5", "#59D044", "#5BB0E5", "#ECD2D8", "#FE787C", "#F08838", "#813B7C", "#F3A002", "#F2F44D", "#F24D98"];

/**
 * DataSet template used for creating dynamic datasets
 */
export const dataSetRef = {
    label: "Aggregated system core's Load",
    fill: false,
    lineTension: 0.2,
    backgroundColor: colorList[0],
    borderColor: colorList[0],
    borderDash: [],
    borderDashOffset: 0.0,
    borderWidth: 2,
    borderJoinStyle: "miter",
    pointBorderWidth: 1,
    data: Array(60).fill(null),
};

/**
 * The chartData set which can be used for loading chart data values
 */
export const chartDataSet = {
    labels: Array(60).join(".").split("."),
    fill: false,
    datasets: [
        {
            label: "Aggregated system core's Load",
            fill: false,
            lineTension: 0.2,
            backgroundColor: colorList[0],
            borderColor: colorList[0],
            //borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderWidth: 2,
            borderJoinStyle: "miter",
            pointBorderWidth: 1,
            data: Array(60).fill(null),
        }
    ]
};

/**
 * Chart options which are used for loading "chart.js" chart
 */
export const chartOptions = {
    showLines: true,
    animation: false,
    tooltips: {
        enabled: false,
    },
    responsive: true,
    scales: {
        yAxes: [{
            ticks: {
                max: 100,
                min: 0,
                stepSize: 25,
                beginAtZero: true,
            },
            scaleLabel: {
                display: true,
                labelString: "Load percentage (%)",
                fontFamily: "Helvetica Neue",
                fontSize: 20,
            },
            gridLines: {
                drawTicks: false,
            }
        }],
        xAxes: [{
            gridLines: {
                display: true,
                drawTicks: false,
            },
            scaleLabel: {
                display: true,
                labelString: "Current Time(mm::ss)",
                fontFamily: "Helvetica Neue",
                fontSize: 20,
            },
            ticks: {
                padding: 10,
            },
        }],
    },
};
