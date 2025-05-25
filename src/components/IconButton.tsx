import React, { ReactNode } from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import {IconSvg} from './IconSvg';

interface IcoButtonProps {
    onPress: () => void;
    label?: string;
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    isflex?: number;
    iconStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

function IcoButton({ onPress, label = '', iconName = 'menu', iconSize = 20, iconColor = 'green', isflex = 1, iconStyle, containerStyle }: IcoButtonProps): ReactNode {
    return (
        <Pressable onPress={onPress} style={[styles.container, isflex ? styles.flex : {}, containerStyle]}>
            <IconSvg name={iconName} size={iconSize} color={iconColor} style={[styles.icon, isflex ? { marginRight: 7 } : null, iconStyle]} />
            {label ? <Text style={[styles.label]}>{label}</Text> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 5,
        marginBottom: 5,
        borderRadius: 5,
        alignItems: 'center', // Align items vertically in the center
        backgroundColor: '#1a73e8',
    },
    iconImage: {

    },
    flex: {
        flexDirection: 'row',
    },
    label: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    icon: {
        padding: 5, backgroundColor: 'white', borderRadius: 5
    },
});

export { IcoButton };
