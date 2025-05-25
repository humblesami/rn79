import { StyleSheet } from 'react-native';

const colors = {
    primary: '#fc5c65',
    secondary: '#4ecdc4',
    black: "#000",
    white: '#fff',
    medium: '#6e6969',
    light: '#eeeeee',
    danger: '#ff5252',
    happy: '#37a337',
    dark: '#0c0c0c',
    button: '#1a73e8'
};

const AppStyles = StyleSheet.create({
    rowContainer: {
        flex: 1,
        padding: 2,
        width: '98%',
        paddingLeft: 10,
        marginBottom: 5,
        flexDirection: "row",
        alignItems: 'center',
    },
    showBorder: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#ccc',
    },
    loader: {
        position: 'absolute',
        zIndex: 3,
        left: 50, top: 5
    },
    btnText: {
        color: 'white',
    },
    active: {
        borderWidth: 1,
        borderColor: 'green',
    },
    field_continer: {
        paddingVertical: 5,
    },
    label: {
        fontWeight: 'bold',
    },
    textField: {
        padding: 12,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderRadius: 5,
    },
    dropDownBox: {
        backgroundColor: 'white', borderRadius: 8,
        height: 40, width: 'auto', minWidth: 150
    },
    button: {
        backgroundColor: colors.button,
        paddingVertical: 5,
        borderRadius: 8,
        color: 'white'
    }
});


export { AppStyles, colors };