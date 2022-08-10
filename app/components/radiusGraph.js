import React, {Component, PropTypes} from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import '../styles/c3Graph.scss';

export default class RadiusGraph extends Component {
    static propTypes = {
        scanData: PropTypes.object.isRequired,
        projectFields: PropTypes.object.isRequired,
        // width: PropTypes.number.isRequired,
        // height: PropTypes.number.isRequired,
        actual: PropTypes.bool.isRequired,
        inch: PropTypes.bool.isRequired,
        limitType: PropTypes.number.isRequired
    };

    constructor(props) {
        super(props);
        this.graph = null;
    }

    componentDidMount() {
        const {props, refs, renderGraph, resizeGraph} = this;
        const {width, height} = props;
        const {graphContainer} = refs;

        this.graph = c3.generate({
            bindto: graphContainer,
            data: {
                columns: [],
                color: function(color, d) {
                    return '#800080';
                }
            },
            size: {
                width: 1,
                height: 1,
            },
            axis: {
                x: {
                    label: {
                        text: 'Degree',
                        position: 'outer-center'
                    },
                    padding: {right: 1},
                    tick: {
                        culling: {
                            max: 1,
                        },
                        format: (x) => this.formatAxis(x)
                    }
                },
                y: {
                    tick: {
                        format: function(d) {
                            return parseFloat(d).toFixed(3)
                        }
                    }
                }
            },
            tooltip: {
                format: {
                    value: function(value, ratio, id, index) {
                        return parseFloat(value).toFixed(4);
                    }
                }
            }
        });

        window.addEventListener('resize', resizeGraph);

        setTimeout(() => {
            renderGraph();
            setTimeout(() => {
                resizeGraph();
            });
        }, 0);
    }

    componentWillUnmount() {
        const {resizeGraph} = this;
        window.removeEventListener('resize', resizeGraph);
    }

    componentDidUpdate(prevProps) {
        this.renderGraph();
    }

    resizeGraph = () => {
        const {graph, refs} = this;
        const {graphContainer} = refs;

        graph.resize({
            width: 1,
            height: 1,
        });

        // Hack for chart resize
        setTimeout(() => {
            const {clientWidth, clientHeight} = graphContainer;
            graph.resize({
                width: clientWidth,
                height: clientHeight,
            });
        }, 0);
    };

    formatAxis = x => {
        const {scanData, limitType} = this.props;
        const {radius} = scanData;
        // return (360 / (radius.length)) * x;
        if (limitType == 1) {
            if (x % 2 == 0) return x;
            else return '';
        }else if (limitType == 2) {
            if (x % 5 == 0) return x;
            else return '';
        }
        return x;
    };

    resetDataForGraph = (keyObj, data) => {

        const {actual, inch, projectFields, limitType} = this.props;
        const ratio = 0.0393701;

        // console.log(limitType);

        var iData = [];
        var newData = [];
        var start = 0;
        var end = data.length;

        if (limitType == 0) {
            start = 0;
        }else if (limitType == 1) {
            start = data.length >= 20 ? data.length - 20 : 0;
        }else if (limitType == 2) {
            start = data.length >= 50 ? data.length - 50 : 0;
        }

        if (actual) {

            for (var i = start; i < data.length; i ++) {
                iData.push(data[i]);
            }
        }else {
            var nominal = (keyObj.upper + keyObj.lower) / 2;
            for (var i = start ; i < data.length; i ++) {
                iData.push(nominal - data[i]);
            }
        }

        if (inch && projectFields.filedUnits !== 'inch') {
            for (var i = 0; i < iData.length; i ++) {
                newData.push(iData[i] * ratio);
            }
            return newData;
        }else if (!inch &&  projectFields.fieldUnits != 'mm') {
            for (var i = 0; i < iData.length; i ++) {
                newData.push(iData[i] / ratio);
            }
            return newData;
        }
        return iData;
    };

    renderGraph = () => {
        const {graph, props} = this;
        const {scanData, projectFields, actual, inch} = props;

        const ratio = 0.0393701;
        const {
            radius,
        } = scanData;

        var i_radius = radius;

        const {
            Radius,
        } = projectFields;

        // console.log(projectFields);

        const graphData = [
            [
                'Radius',
                ...this.resetDataForGraph(Radius, i_radius).map(v => v.toFixed(4)),
            ]
        ];

        var upperTolerance = parseFloat(parseFloat(actual ? Radius.upper : Radius.upper - Radius.nominal).toFixed(3));
        var lowerTolerance = parseFloat(parseFloat(actual ? Radius.lower: Radius.lower - Radius.nominal).toFixed(3));
        var yMax = parseFloat(parseFloat(upperTolerance + (upperTolerance - lowerTolerance) / 2).toFixed(3));
        var yMin = parseFloat(parseFloat(lowerTolerance - (upperTolerance - lowerTolerance) / 2).toFixed(3));

        if (inch && projectFields.filedUnits !== 'inch') {
            upperTolerance *= ratio;
            lowerTolerance *= ratio;
            yMax *= ratio;
            yMin *= ratio;
        }else if (!inch &&  projectFields.fieldUnits != 'mm') {
            upperTolerance /= ratio;
            lowerTolerance /= ratio;
            yMax /= ratio;
            yMin /= ratio;
        }

        // draw grid
        graph.ygrids([
            {value: 0},
            {
                value: upperTolerance,
                text: 'Upper Tolerance',
                position: 'start'
            },
            {
                value: lowerTolerance,
                text: 'Lower Tolerance',
                position: 'start'
            }
        ]);


        // update axis
        graph.axis.min({
            y: yMin,
        });

        graph.axis.max({
            y: yMax,
        });

        // load chart data
        graph.load({
            columns: [...graphData],
        });
    };

    render() {
        return (
            <div
                className="graphContainer"
                ref="graphContainer"
            />
        );
    }
}
