import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    row: {
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        justifyContent: 'space-between'
    },
    formHeading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold',
    },
    list: {
    },
    time: {
        fontSize: 14,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'capitalize'
    },
    input: {
        color: '#000',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        minHeight: 10,
        borderRadius: 2,
        padding: 8
    },
    amount: {
        fontWeight: '600',
        fontSize: 16,
    },
    border: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
    },
    wrap: {
        flex: 1, flexDirection: 'row', flexWrap: "wrap"
    },
    rowItem: {
        padding: 4,
    },
    bottomInput: {
        padding: 5,
        borderColor: '#ccc',
        verticalAlign: 'bottom'
    },
    flexContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    cell: {

    },
    text: {
        color: 'green',
    },
});
export { styles, screenHeight, screenWidth };
