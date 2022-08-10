import React, {Component, PropTypes} from 'react';
import ToggleUnit from './toggleUnit';
import '../styles/inputNumberUnit.scss';

const convertInchToMetric = v => v * 25.4;
const convertMetricToInch = v => v / 25.4;

export default class InputNumberUnit extends Component {
    static propTypes = {
        onUpperChange: PropTypes.func.isRequired,
        onLowerChange: PropTypes.func.isRequired,
        onNominalChange: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        onUnitChange: PropTypes.func.isRequired,
        value: PropTypes.object,
        inch: PropTypes.bool,
    };

    static defaultProps = {
        value: {
            upper: 0,
            lower: 0,
            nominal: 0
        },
        inch: false,
    };

    constructor(props) {
        super(props);
        const {value, inch} = props;
        this.state = {
            value: {
                upper: inch === true ? convertInchToMetric(value.upper).toFixed(4) : value.upper,
                lower: inch === true ? convertInchToMetric(value.lower).toFixed(4) : value.lower,
                nominal: inch === true ? convertInchToMetric(value.nominal).toFixed(4) : value.nominal
            },
        };
    }

    handleChangeUnit = unitType => {
        const {onUnitChange} = this.props;
        if (onUnitChange) onUnitChange(unitType);
    };

    handleUpperChange = () => {
        const {inch} = this.props;

        const inputValue = parseFloat(this.refs.inputUpperValue.value);
        // console.log(inputValue);
        const retValue = (inch === true) ?
            convertInchToMetric(inputValue).toFixed(4) : inputValue;

        this.props.onUpperChange(retValue);
    };

    handleLowerChange = () => {
        const {inch} = this.props;

        const inputValue = parseFloat(this.refs.inputLowerValue.value);
        const retValue = (inch === true) ?
            convertInchToMetric(inputValue).toFixed(4) : inputValue;

        this.props.onLowerChange(retValue);
    };

    handleNominalChange = () => {
        const {inch} = this.props;

        const inputValue = parseFloat(this.refs.inputNominalValue.value);
        const retValue = (inch === true) ?
            convertInchToMetric(inputValue).toFixed(4) : inputValue;

        this.props.onNominalChange(retValue);
    };


    render() {
        const {props, state, handleUpperChange, handleLowerChange, handleNominalChange, handleChangeUnit} = this;
        const {label, inch, value} = props;
        const unitLabel = inch === true ? 'inch' : 'mm';
        const upperValueConverted = inch === true ? convertMetricToInch(value.upper).toFixed(4) : value.upper;
        const lowerValueConverted = inch === true ? convertMetricToInch(value.lower).toFixed(4) : value.lower;
        const nominalValueConverted = inch === true ? convertMetricToInch(value.nominal).toFixed(4) : value.nominal;

        return (
            <div className="inputNumberUnitContainer">
                <div className="inputNumberLabelContainer">
                    <span>{label}</span>
                </div>
                <div className="inputNumberUnitBlock">
                    <input
                        ref="inputUpperValue"
                        type="number"
                        value={upperValueConverted}
                        onChange={handleUpperChange}
                        className="inputNumberUnitInput"
                    />
                    <input
                        ref="inputLowerValue"
                        type="number"
                        value={lowerValueConverted}
                        onChange={handleLowerChange}
                        className="inputNumberUnitInput"
                    />
                    <input
                        ref="inputNominalValue"
                        type="number"
                        value={nominalValueConverted}
                        onChange={handleNominalChange}
                        className="inputNumberUnitInput"
                    />
                </div>
                <div className="inputNumberDescription">
                    <span>Upper Tolerance / Lower Tolerance / Nominal</span>
                </div>
            </div>
        );
    }
}
