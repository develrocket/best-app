import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import '../styles/field.scss';
import FieldList from './fieldList'

class DynamicField extends Component {

    static propTypes = {
        manualField: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            fields: []
        };
    }

    componentDidMount = () => {
        const {
            manualField
        } = this.props;

        var newFields = [];
        var index = 0;
        for (var i = 0; i < manualField.length; i ++) {
            var item = manualField[i];
            if (item.mKey != '') {
                newFields.push({
                    fKey : 'input-' + index,
                    fValue : item.mValue
                });
                index ++;
            }
        }

        this.setState({fields: newFields});
    };

    handleClick = e => {
        e.preventDefault();
        var fields = this.state.fields;
        var newField = {
            fKey: 'input-' + this.state.fields.length,
            fValue: ''
        };
        var newFields = fields.concat(newField);
        this.setState({fields: newFields});
    };

    render() {
        return (
            <div className="container">
                <FieldList fields={this.state.fields} />
                <a href="" className="bonus-field add" onClick={this.handleClick}>
                    <i className="icon icon-plus"></i>
                    {this.props.actionName}
                </a>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        manualField
    } = state;

    return {
        manualField
    };
}

export default connect(mapStateToProps)(DynamicField);
