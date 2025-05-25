import React, { Component } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';

const pickerContaineStyle: ViewStyle = {
    padding: 0
}

const defaultPickerStyle: ViewStyle = {
    width: 100,
    padding: 0,
    marginLeft: 3,
    backgroundColor: 'white',
}

interface DateProps {
    onDateChanged: Function
    defulatDate?: Date,
    style?: ViewStyle,
    labelStyle?: TextStyle
    inputContainerStyle?: ViewStyle
    itemStyle?: ViewStyle,
    hideLabel?: boolean,    
}

interface StateProps {
    year: number | string,
    date: number | string,
    month: number | string,
    daysInMonth: number[],
    strDate: string,
    dateObject: Date
}

export default class DigitalDatePicker extends Component<DateProps, StateProps> {
    years: number[] = [];
    months: number[] = [];

    constructor(props: DateProps) {
        super(props);
        for (let i = 2000; i <= 2099; i++) {
            this.years.push(i);
        }

        for (let i = 1; i <= 12; i++) {
            this.months.push(i);
        }

        let givenDate = new Date();
        if (props.defulatDate) {
            givenDate = props.defulatDate;
        }

        let curYear = givenDate.getFullYear();
        let curDate = givenDate.getDate();
        let curMonth = givenDate.getMonth() + 1;

        this.state = {
            year: curYear,
            date: curDate,
            month: curMonth,
            strDate: '',
            dateObject: new Date(),
            daysInMonth: [],
        }

        for (let i = 1; i <= 28; i++) {
            this.state.daysInMonth.push(i);
        }
        this.setMonthDays(curMonth, curYear);
    }

    updateDate(val: any, upd: string) {
        let year = this.state.year;
        let month = this.state.month;
        let date = this.state.date;
        if (upd == 'date') {
            date = val;
        }
        if (upd == 'month') {
            month = val;
        }
        if (upd == 'year') {
            year = val;
        }
        const newYear = parseInt('' + year);
        const newMonth = parseInt('' + month); // Month is 0-indexed
        let newDate = parseInt('' + date);

        this.setMonthDays(month, year);
        let isInValiddate = this.state.daysInMonth.indexOf(newDate) == -1;
        if ((upd == 'month' || upd == 'year') && isInValiddate) {
            newDate = this.state.daysInMonth[this.state.daysInMonth.length - 1];
        }
        let temp_str = `${newYear}-${(newMonth).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
        let temp_dt = new Date(temp_str);
        this.setState({ month: newMonth, year: newYear, date: newDate, dateObject: temp_dt })
        this.props.onDateChanged(temp_dt);
    }

    getDaysInMonth(mon: string | number, year: number): number {
        switch ('' + mon) {
            case '1':
                return 31;
            case '2':
                if (year % 4) return 28;
                else return 29;
            case '3':
                return 31;
            case '4':
                return 30;
            case '5':
                return 31;
            case '6':
                return 30;
            case '7':
                return 31;
            case '8':
                return 31;
            case '9':
                return 30;
            case '10':
                return 31;
            case '11':
                return 30;
            case '12':
                return 31;
        }
        return 0;
    }

    setMonthDays(month: string | number, year: string | number) {
        let pre = this.state.daysInMonth;
        year = parseInt('' + year);
        let now = this.getDaysInMonth(month, year);
        if (now > pre.length) {
            for (let i = pre.length + 1; i <= now; i++) {
                this.state.daysInMonth.push(i);
            }
        }
        else {
            for (let i = pre.length; i >= now; i--) {
                this.state.daysInMonth.pop();
            }
        }
    }

    render() {
        let ob_it = this;
        let { year, month, date, daysInMonth } = this.state;
        return (
            <View style={[pickerContaineStyle, this.props.style]}>
                {
                    this.props.hideLabel ? <></>
                        : <Text>Selected Date: {year}-{(month).toString().padStart(2, '0')}-{date.toString().padStart(2, '0')}</Text>
                }

                <View style={[{ flexDirection: 'row', marginVertical: 4 }, this.props.inputContainerStyle]}>
                    <RNPicker
                        style={[defaultPickerStyle, { height: 20, width: 128 }, this.props.itemStyle]}
                        selectedValue={year}
                        onValueChange={(value) => ob_it.updateDate(value, 'year')}
                    >
                        {
                            this.years.map((item) => (
                                <RNPicker.Item key={item} label={item.toString()} value={item} />
                            ))
                        }
                    </RNPicker>
                    <RNPicker
                        style={[defaultPickerStyle, this.props.itemStyle]}
                        selectedValue={month}
                        onValueChange={(value) => ob_it.updateDate(value, 'month')}
                    >
                        {
                            this.months.map((item) => (
                                <RNPicker.Item key={item} label={item.toString().padStart(2, '0')} value={item} />
                            ))
                        }
                    </RNPicker>
                    <RNPicker
                        style={[defaultPickerStyle, this.props.itemStyle]}
                        selectedValue={date}
                        onValueChange={(value) => ob_it.updateDate(value, 'date')}
                    >
                        {
                            daysInMonth.map((item) => (
                                <RNPicker.Item key={item} label={item.toString().padStart(2, '0')} value={item} />
                            ))
                        }
                    </RNPicker>
                </View>
            </View>
        );
    }
}
