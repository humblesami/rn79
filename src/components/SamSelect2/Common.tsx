import { StyleSheet } from 'react-native';

const Select2Styles = StyleSheet.create({
    addBtn: {
        backgroundColor: 'green',
        borderRadius: 2,
        padding: 8,
        marginTop: 3,
        marginLeft: 5
    },
    cancelBtn: {
        padding: 5,
        borderRadius: 2,
        backgroundColor: 'red',
    },
    selectedItemStyle: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        marginHorizontal: 3,
        marginBottom: 2,

        borderRadius: 5,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',

        minwidth: 40,
        maxWidth: '50%',
        flexDirection: 'row',
        flexBasis: 'auto',
    },
    singleSelectedItemStyle:{
        flex: 0,
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    },
    selection_container: {
        marginBottom: 2,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    stlistItem: {
        padding: 8,
        marginBottom: 4,
        backgroundColor: '#ddd',
    },
    pressed: {
        backgroundColor: 'blue'
    },
});


export {Select2Styles};