import React, {Component, PropTypes} from 'react';
import '../styles/inputText.scss';
import ManualInputText from './manualInputText';

export default class ManualInputTextList extends Component {

    render() {

        var fields = this.props.fields.map(function(field, i) {
            return (
                <ManualInputText
                    key={i}
                    ref={field.mKey}
                    inputKey={field.mKey}
                    label={field.mValue}
                    keyName={field.mKey}
                    fieldValue={field.mRValue}
                    index={i}
                />
            );
        });

        return (
            <div>
                {fields}
            </div>
        );
    }
}
