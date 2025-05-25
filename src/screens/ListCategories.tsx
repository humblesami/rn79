import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import AbstractScreen from '../components/AbstractScreen';
import { TransactionDb as transaction_db } from '../watermelon/TransactionDb';
import { CategoryModel } from '../watermelon/schema';
import SamDateTime from '../services/SamDateTime';
import PaginationView from '../components/PaginationView';
import { Q } from '@nozbe/watermelondb';
import FlexView from '../components/FlexView';
import DigitalDatePicker from '../components/DigitalDatePicker';
import { PropsType } from '../types';


class ListCategoriesScreen extends AbstractScreen {
    private page_data;
    constructor(props: PropsType) {
        super(props, 'list_categories');
        this.page_data = {
            record_count: 0,
            offset: 0,
            per_page: 20,
        };
        this.state = {
            ...this.state,
            data_loading: 'Loading Categories',
            showChildren: false,
        };
    }

    async fetchMyData() {
        try {
            let startTime = (Date.now() - 1000 * 60 * 60 * 24 * 5);
            if (this.props.defaultDateFrom) {
                startTime = this.props.defaultDateFrom.getTime();
            }            
            // let params = [Q.where('created_at', Q.gte(startTime))];
            let params = [Q.where('created_at', Q.gte(startTime))];
            let res = await transaction_db.searchCategoriesWithTransactions(params, this.page_data);
            this.setState({ data_loading: '', objects_list: res });
        } catch (err) {
            let message = 'Error in getting categories ' + err;
            this.issues['screen_data'] = message;
        }
    }

    async deleleCategory(itemData: Record<string, any>, index: number) {
        let obj_it = this;
        try {
            let childrenToDelete = [{ table: 'category_transaction', relation_key: 'category_id' }];
            //let res = await transaction_db.deleteRecordWithChildren('categories', itemData, childrenToDelete);
            let res = await transaction_db.deleteRecordById('categories', itemData.id);
            if (res.status) {
                obj_it.state.objects_list.splice(index, 1);
            } else {
                obj_it.issues['delete_categroy'] = res.error;
            }
        } catch (err) {
            obj_it.issues['delete_categroy'] = 'Error in force del cat ' + err;
        }
        obj_it.setState({});
    }

    fromDateDateUpdated(dt: Date){
        
    }

    render() {
        let obj_it = this;
        let allCategories = obj_it.state.objects_list;
        if (this.state.data_loading) {
            return (
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 20 }}>{this.state.data_loading}</Text>
                </View>
            );
        }
        let a_month_earlier = SamDateTime.addInterval(-30, 'day') || new Date();
        let column_ratio: any[] = ['25%', '20%', '40%', '10%'];
        return (
            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                {obj_it.render_errors()}
                {obj_it.render_messages()}

                <DigitalDatePicker onDateChanged={(dt: Date) => { obj_it.fromDateDateUpdated(dt) }} defulatDate={a_month_earlier} />

                <FlexView style={{ justifyContent: 'center' }}>
                    <Pressable style={[styles.button, { width: 200, height: 36 }]} onPress={() => obj_it.setState({ showChildren: !obj_it.state.showChildren })}>
                        <Text style={styles.btnText}>Show/Hide Transactions</Text>
                    </Pressable>
                    <></>
                </FlexView>

                <PaginationView given_limit={obj_it.page_data.per_page} offset={this.page_data.offset}
                    total_records={obj_it.page_data.record_count}
                    onStartIndexChanged={async (off_set: number) => {
                        obj_it.page_data.offset = off_set;
                        obj_it.fetchMyData();
                    }}
                    onLimitChanged={async (off_set: number, records_on_page: number) => {
                        obj_it.page_data.per_page = records_on_page;
                        obj_it.page_data.offset = off_set;
                        obj_it.fetchMyData();
                    }}
                />
                <View>
                    <View style={[styles.flex]}>
                        <Text style={[styles.h5, { width: column_ratio[0] }]}>Name</Text>
                        <Text style={[styles.h5, { width: column_ratio[1] }]}>Amount</Text>
                        <Text style={[styles.h5, { width: column_ratio[2] }]}>Time</Text>
                    </View>

                    <ScrollView style={{ paddingBottom: 10, height: obj_it.winHeight - 350 }}>
                        {
                            allCategories.map((cat_item: CategoryModel, index: number) => {
                                return (
                                    <View key={index} style={{ marginTop: 2 }}>
                                        <Pressable style={[styles.pressableItem, styles.flex]} onPress={() => { }}>
                                            <Text style={[styles.listItemText, { width: column_ratio[0] }]}>{cat_item.title.toUpperCase()}</Text>
                                            <Text style={[styles.listItemText, { width: column_ratio[1] }]}>{cat_item.total_amount}</Text>
                                            <Text style={[styles.listItemText, { width: column_ratio[2] }]}>{SamDateTime.formatMoment(cat_item.created_at, 'DD MMM, h:mm A')}</Text>
                                            {
                                                cat_item.transaction_list.length ?
                                                    <Text style={[{ alignItems: 'flex-end' }]}> </Text> :
                                                    <Pressable style={[{ alignItems: 'flex-end' }]} onPress={() => obj_it.deleleCategory(cat_item, index)}>
                                                        <View style={styles.deleteButton}>
                                                            <Text style={{ color: 'white' }}>X</Text>
                                                        </View>
                                                    </Pressable>
                                            }
                                        </Pressable>
                                        {
                                            !obj_it.state.showChildren ? <></> :
                                                <View>
                                                    <Text style={{ fontWeight: 'bold', paddingLeft: 30 }}>Transactions List</Text>
                                                    {
                                                        cat_item.transaction_list.map((tr_item: any, index: number) => {
                                                            return (
                                                                <View style={[{ padding: 5, marginVertical: 2 }, styles.border, styles.row]} key={index}>
                                                                    <Text style={[{ width: column_ratio[0] }]}>{tr_item.title}</Text>
                                                                    <Text style={[{ width: column_ratio[1] }]}>{tr_item.amount}</Text>
                                                                    <Text style={[{ width: column_ratio[2] }]}>{SamDateTime.formatMoment(tr_item.created_at, 'DD MMM, h:mm A')}</Text>
                                                                    <Text ></Text>
                                                                </View>
                                                            );
                                                        })
                                                    }
                                                </View>
                                        }
                                    </View>
                                );
                            })
                        }

                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        flex: 1, padding: 6, borderRadius: 4, borderWidth: 1,
        backgroundColor: '#eee', maxWidth: '100%',
        marginBottom: 2, borderColor: '#ddd',
        flexDirection: 'row'
    },
    flex: {
        flexDirection: 'row'
    },
    header: {
        paddingLeft: 5,
        fontSize: 20,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: 'rgb(33, 150, 243)', alignItems: 'center', justifyContent: 'center',
        height: 25, borderRadius: 2, marginRight: 5,
    },
    btnText: {
        color: 'white',
    },
    row: {
        borderRadius: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    listItemText: {
        fontSize: 16,
        paddingLeft: 5,
    },
    deleteButton: {
        backgroundColor: '#f16d6b', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 25, borderRadius: 100, marginRight: 5,
    },
    editButton: {
        backgroundColor: '#f16d6b', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 25, borderRadius: 100, marginRight: 5
    },
    h5: {
        fontWeight: 'bold',
        padding: 5,
        fontSize: 16,
    },
    border: {
        borderRadius: 3, borderColor: '#ddd', borderWidth: 1,
    },
    pressableItem: { backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 2, borderRadius: 5, marginBottom: 5, padding: 5, }
});

export { ListCategoriesScreen }