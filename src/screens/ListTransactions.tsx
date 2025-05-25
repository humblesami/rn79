import React from 'react';
import { Alert, Text, TextInput, View, ScrollView } from 'react-native';
import { Button } from '../components/Button';
import { StyleSheet } from 'react-native';
import { styles, screenHeight } from '../components/ComponentStyles';
import { SamSelect2 } from '../components/SamSelect2/SamSelect2';
import { TransactionDb } from '../watermelon/TransactionDb';
import AbstractScreen from '../components/AbstractScreen';
import FlexView from '../components/FlexView';
import PaginationView from '../components/PaginationView';
import SamDateTime from '../services/SamDateTime';
import { Q } from '@nozbe/watermelondb';
import DigitalDatePicker from '../components/DigitalDatePicker';


class ListTransactions extends AbstractScreen {
    protected headers: string[] = ['Rs', 'Categories', 'Title', 'Time', 'Edit'];
    protected col_ratio: any[] = ['10%', '39%', '18.3%', '19.2%', '13.5%'];
    protected defaultCategories: any = null;
    private page_data;
    protected defaultStartDate: Date = SamDateTime.addInterval(-30, 'day');
    constructor(props: any) {
        super(props);
        this.page_data = {
            record_count: 0,
            offset: 0,
            per_page: 10,
        };
        this.state = {
            ...this.state,
            data_loading: 'Loading Transactions',
            editMode: 0,
        }
    }

    async componentDidMount() {
        if (!this.mounted) {
            this.mounted = 1;
        }
        this.fetchMyData(0);
    }

    fromDateDateUpdated(dt: Date) {
        if (dt && dt != this.defaultStartDate) {
            this.defaultStartDate = dt;
            this.fetchMyData(0);
        }
    }

    async fetchMyData(edit_mode = 0) {
        try {
            let startTime = this.defaultStartDate.getTime();            
            let params = [Q.where('created_at', Q.gte(startTime))];
            let mapped_data = await TransactionDb.getTransactions(params, this.page_data);
            this.defaultCategories = await TransactionDb.searchCategories([], this.page_data);
            this.setState({ objects_list: mapped_data, editMode: edit_mode });
        }
        catch (err) {
            let message = 'Error in fetching transactions => ' + err;
            this.issues['init'] = message;
            console.log(message);
        }
    }

    updateRow(row_data: any, params: any) {
        for (let key in params) {
            row_data[key] = params[key];
            row_data.changed_fields[key] = 1;
        }
    }

    edit_row_data: Record<string, any> = {
        id: '',
        amount: '',
        title: 'new',
        created_at: '',
        changed_fields: {},
        related_categories: [],
    };

    render() {
        let obj_it = this;
        let headers = obj_it.headers;
        let parent_table = 'transactions';
        let child_relations = [{
            table: 'trans_cats',
            relation_key: 'transaction_id'
        }];

        if (Object.keys(this.issues).length) {
            return this.render_errors();
        }

        if (this.state.editMode) {
            return renderEditForm();
        }

        function onSelectionChanged(row_data: any, selection = []) {
            obj_it.updateRow(row_data, { related_categories: selection });
            if (row_data.id) {
                updateTransaction(row_data, 1);
            }
        }

        async function createTransaction(row_data: any) {
            let parent_data: Record<string, any> = {};
            let categories_data = row_data.related_categories;
            for (let key in row_data) {
                parent_data[key] = row_data[key];
            }
            if (!parent_data.title || !parent_data.amount) {
                console.log('Please provide title and amount');
                return;
            }

            let children = TransactionDb.addChildren([], { ...child_relations[0], data: categories_data });
            let res = await TransactionDb.createWithChildren(parent_table, parent_data, children);
            if (res.status) {
                await obj_it.fetchMyData();
            }
            else {
                obj_it.setState({});
            }
        }

        async function deleteRecord(row_data: Record<string, any>) {
            let res = await TransactionDb.deleteRecordWithChildren(parent_table, row_data, child_relations);
            if (res.status) {
                obj_it.fetchMyData();
            }
        }

        async function updateTransaction(itemData: any, avoid_reload = 0) {
            let categories_data = itemData.related_categories;
            let children = TransactionDb.addChildren([], { ...child_relations[0], data: categories_data });

            let parent_data: any = {};
            for (let key in itemData) {
                parent_data[key] = itemData[key];
            }
            await TransactionDb.updateRecord(parent_table, parent_data, children);
            if (!avoid_reload) {
                obj_it.fetchMyData();
            }
        }

        function renderEditForm() {
            let editRow = obj_it.edit_row_data;
            return (
                <ScrollView nestedScrollEnabled={true} style={{ padding: 10, paddingVertical: 20, maxHeight: screenHeight - 150 }}>
                    <Text style={styles.formHeading}>Update Transaction</Text>

                    <View style={{}}>
                        <Text style={styles.headerText}>Amount</Text>
                        <TextInput keyboardType='numeric' onChangeText={(txt) => obj_it.updateRow(editRow, { amount: parseInt(txt) })}
                            defaultValue={'' + editRow.amount} style={[styles.input]} />
                    </View>

                    <View style={[{ paddingTop: 10 }]}>
                        <Text style={styles.headerText}>Categories</Text>
                        {
                            !Array.isArray(obj_it.defaultCategories) ? <Text>Loading Categories Yet</Text> :
                                <SamSelect2
                                    defaultItems={obj_it.defaultCategories}
                                    selectedItems={editRow.related_categories}
                                    displayField='title'
                                    css={{ container: { paddingBottom: 5 } }}
                                    events={{
                                        onSearch: async (search_kw: string) => {
                                            let params = [];
                                            params.push(Q.sortBy('title'));
                                            if (search_kw) {
                                                params.push(Q.where('title', Q.like(`%${search_kw}%`)));
                                            }
                                            let res = await TransactionDb.searchCategories(params, { offset: 0, record_count: 0, per_page: 20 });
                                            return res;
                                        },
                                        onItemSelected: (item: any, selection: any) => { onSelectionChanged(editRow, selection) },
                                        onItemAdded: async (item: any, selection: any) => {
                                            let itemToCreate = { title: (item.name || item.title) };
                                            if (!itemToCreate.title) {
                                                Alert.alert('No title/name given for category');
                                                return;
                                            }
                                            let rest = await TransactionDb.createWithChildren('categories', itemToCreate, []);
                                            let createdItem = rest.data;
                                            let new_selection: any = [];
                                            for (let sl_item of selection) {
                                                new_selection.push(sl_item);
                                            }
                                            new_selection.push(createdItem);
                                            onSelectionChanged(editRow, new_selection);
                                            return createdItem;
                                        },
                                        onItemUnselected: (item: any, selection: any, index: any) => { onSelectionChanged(editRow, selection) },
                                    }}
                                />
                        }

                    </View>

                    <View style={{}}>
                        <Text style={styles.headerText}>Title</Text>
                        <TextInput onChangeText={(txt) => obj_it.updateRow(editRow, { title: txt })}
                            defaultValue={'' + editRow.title} style={[styles.input]} />
                    </View>

                    <View style={{ paddingTop: 10 }}>
                        {
                            editRow.id ?
                                <FlexView>
                                    <Button onPress={() => deleteRecord(editRow)} title='Delete' />
                                    <Button onPress={() =>
                                        updateTransaction(editRow)
                                    } title='Update' />
                                    <Button onPress={() => obj_it.fetchMyData()} title='Show List'></Button>
                                </FlexView>
                                :
                                <FlexView>
                                    <Button onPress={() => createTransaction(editRow)} title='Save'></Button>
                                    <Button onPress={() => obj_it.fetchMyData()} title='Show List'></Button>
                                </FlexView>
                        }
                    </View>
                </ScrollView>
            );
        }

        function callEditing(rowToEdit: any) {
            obj_it.edit_row_data = {
                id: '',
                amount: '',
                title: 'new',
                created_at: '',
                changed_fields: {},
                related_categories: [],
            };
            for (let key in rowToEdit) {
                if (rowToEdit[key]) {
                    obj_it.edit_row_data[key] = rowToEdit[key];
                }
            }
            obj_it.setState({ editMode: 1 });
        }

        return (
            <View style={{ padding: 10 }}>
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

                <DigitalDatePicker onDateChanged={(dt: Date) => { obj_it.fromDateDateUpdated(dt) }} defulatDate={obj_it.defaultStartDate} />

                <Button onPress={() => callEditing({})} title='Add New' />

                <View style={[styles.flexContainer, { paddingTop: 10 }]}>{
                    headers.map((cell_data, i) =>
                        <View key={i} style={[styles.border, { width: obj_it.col_ratio[i], padding: 4 }]}>
                            <Text style={[styles.headerText]}>{cell_data}</Text>
                        </View>
                    )
                }</View>

                <ScrollView style={{ paddingTop: 2, maxHeight: screenHeight - 200 }}>
                    {
                        obj_it.state.objects_list.map((item: any, key: any) => (
                            <View key={key} style={[styles.flexContainer, local_styles.trans_row]}>
                                <View style={[{ width: obj_it.col_ratio[0], }, local_styles.cell]}>
                                    <Text style={[styles.bold, { color: 'red' }]}>{item.amount}</Text>
                                </View>

                                <View style={[{ padding: 2, width: obj_it.col_ratio[1], }, styles.wrap, local_styles.cell]}>
                                    {
                                        item.related_categories.map(function (item: any, key: any) {
                                            return (
                                                <View key={key} style={[styles.border, { padding: 5, marginRight: 1, marginBottom: 1 }]}>
                                                    <Text>{item.title}</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                                <View style={[{ padding: 4, width: obj_it.col_ratio[2], }, local_styles.cell]}>
                                    <Text>{'' + item.title}</Text>
                                </View>
                                <View style={[{ padding: 4, width: obj_it.col_ratio[3], }, local_styles.cell]}>
                                    <Text style={styles.time}>{item.created_at ? SamDateTime.formatMoment(item.created_at, 'DD/M h:mmA') : 'TBA'}</Text>
                                </View>

                                <View style={{ width: obj_it.col_ratio[4], }}>
                                    <Button onPress={() => callEditing(item)} title='Edit' />
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        );
    }
}


const local_styles = StyleSheet.create({
    trans_row: {
        borderColor: '#bbb',
        borderRadius: 5,
        borderWidth: 1,
    },
    cell: {
        backgroundColor: '#fefefe',
        borderColor: '#ddd',
        padding: 2,
        borderRightWidth: 1,
    },
});

export { ListTransactions }