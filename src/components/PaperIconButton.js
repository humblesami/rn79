import React from 'react';
import { TouchableOpacity } from 'react-native';

const PaperButton = ({ onPress, disabled, icon, ...rest }) => {
    console.log('Proof that it used this as icon button')
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            {...rest}
        >
            Press Me
        </TouchableOpacity>
    );
};

export default PaperButton;