import React, {Component, PropTypes} from 'react';
import '../styles/field.scss';
import Field from './field';

export default class FieldList extends Component {

    render() {
        var fields = this.props.fields.map(function(field, i) {
            return (
                <Field key={field.fKey} inputKey={field.fKey} index={i} fieldValue={field.fValue}/>
            );
        });

        return (
            <div className="field-list field-input">
                {fields}
            </div>
        );
    }
}
