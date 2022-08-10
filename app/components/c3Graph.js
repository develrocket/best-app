import React, {Component, PropTypes} from 'react';
import c3 from 'c3';
import 'c3/c3.css';
import '../styles/c3Graph.scss';

export default class Graph extends Component {
    static propTypes = {
        scanData: PropTypes.object.isRequired,
        projectFields: PropTypes.object.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
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
            },
            tooltip: {
                format: {
                    value: function(value, ratio, id, index) {
                        const {scanData} = props;
                        const {
                            radius,
                            bevelAngle,
                            landThickness,
                            halfBevelGap,
                            wallThickness,
                        } = scanData;

                        var data = [];

                        if (id == "Radius") data = radius;
                        if (id == "Bevel Angle") data = bevelAngle;
                        if (id == "Land Thickness") data = landThickness;
                        if (id == "Half Bevel Gap") data = halfBevelGap;
                        if (id == "Wall Thickness") data = wallThickness;

                        return data[index];
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
                width: clientWidth - 30,
                height: clientHeight - 30,
            });
        }, 0);
    };

    formatAxis = x => {
        const {scanData} = this.props;
        const {radius} = scanData;
        return (360 / (radius.length)) * x;
    };

    resetDataForGraph = (keyObj, data) => {

        var gMax = 100;
        var gMin = -100;
        var minValue = Math.min.apply(Math, data);
        var maxValue = Math.max.apply(Math, data);
        var newData = [];
        var nominalValue = keyObj.nominal;

        if (keyObj.upper != 0) maxValue = keyObj.upper;
        if (keyObj.lower != 0) minValue = keyObj.lower;

        if (nominalValue == 0) nominalValue = (maxValue + minValue) / 2;

        var realNominalValue = gMax - (gMax - gMin) * (maxValue - nominalValue) / (maxValue - minValue);

        for (var i = 0 ; i < data.length; i ++) {
            newData.push(gMax - (gMax - gMin) * (maxValue - data[i]) / (maxValue - minValue) - realNominalValue);
        }

        // console.log('***************************');
        // console.log('maxValue:', maxValue);
        // console.log('minValue:', minValue);
        // console.log('nominalValue:', nominalValue);
        // console.log(realNominalValue);
        // console.log(newData);

        return newData;
    };

    convertValueToGraph = (value, data) =>  {

        var gMax = 100;
        var gMin = -100;
        var minValue = Math.min.apply(Math, data);
        var maxValue = Math.max.apply(Math, data);

        return gMax - (gMax - gMin) * (maxValue - value) / (maxValue - minValue);
    };

    renderGraph = () => {
        const {graph, props} = this;
        const {scanData, projectFields} = props;

        const {
            radius,
            bevelAngle,
            landThickness,
            halfBevelGap,
            wallThickness,
        } = scanData;

        var i_radius = radius;
        var i_bevelAngle = bevelAngle;
        var i_landThickness = landThickness;
        var i_halfBevelGap = halfBevelGap;
        var i_wallThickness = wallThickness;

        const {
            Radius,
            BevelAngle,
            LandThickness,
            HalfBevelGap,
            WallThickness,
        } = projectFields;

        const graphData = [
            [
                'Radius',
                ...this.resetDataForGraph(Radius, i_radius).map(v => v.toFixed(4)),
            ],
            [
                'Bevel Angle',
                ...this.resetDataForGraph(BevelAngle, i_bevelAngle).map(v => v.toFixed(4)),
            ],
            [
                'Land Thickness',
                ...this.resetDataForGraph(LandThickness, i_landThickness).map(v => v.toFixed(4)),
            ],
            [
                'Half Bevel Gap',
                ...this.resetDataForGraph(HalfBevelGap, i_halfBevelGap).map(v => v.toFixed(4)),
            ],
            [
                'Wall Thickness',
                ...this.resetDataForGraph(WallThickness, i_wallThickness).map(v => v.toFixed(4)),
            ],
        ];

        // draw grid
        graph.ygrids([
            {value: 0},
            {
                value: 100,
                text: 'Upper Tolerance',
                position: 'start'
            },
            {
                value: -100,
                text: 'Lower Tolerance',
                position: 'start'
            }
        ]);


        // update axis
        graph.axis.min({
            y: -150,
        });

        graph.axis.max({
            y: 150,
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
