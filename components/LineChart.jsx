import React from 'react';
import ReactDOM from "react-dom";
import Chart from "chart.js";

/**
 * LineChart component for creating chart.js graph
 */
export default class LineChart extends React.Component {
     /**
     * constructor
     */
    constructor() {
        super();
        /**
         * @type {object}
         * @property {string} chart chart.js graph value
         */
        this.state = {
            chart: null
        };
    }
    /**
     * Creates a chart with given data set
     * @param {object} nextProps would have updated data and options for the chart 
     */
    initializeChart(nextProps) {
        let el = ReactDOM.findDOMNode(this.refs.chart);
        let ctx = el.getContext("2d");
        this.state.chart = new Chart(ctx, {
            type: 'line',
            data: nextProps.data,
            options: nextProps.options
        });
    }
    /**
     * Once the component is mounted create a chart and update the component
     */
    componentDidMount() {
        this.initializeChart(this.props);
    };

    /**
     * When component is unmounted delete the chart
     */
    componentWillUnmount() {
        var chart = this.state.chart;
        chart.destroy();
    };

    /**
     * will update the chart if the props of the component change
     * @param {object} nextProps would have updated data and options for the chart 
     */
    componentWillReceiveProps(nextProps) {
        var chart = this.state.chart;
        // assign all of the properites from the next datasets to the current chart
        nextProps.data.datasets.forEach(function (set, setIndex) {
            const chartDataset = {};
            for (var property in set) {
                if (set.hasOwnProperty(property)) {
                    chartDataset[property] = set[property];
                }
            }
            chart.data.datasets[setIndex] = chartDataset;
        });
        chart.data.labels = nextProps.data.labels;
        chart.update();
    };

    /**
     * renders the chart.js chart
     * @return {ReactElement} markup
     */
    render() {
        return (<canvas ref="chart" className="lineChart" style={{ height: "40vh", width: "75vw" }} />);
    }
}
