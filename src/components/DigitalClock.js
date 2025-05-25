import React, { Component } from 'react';
import { Text, View } from 'react-native';

class DigitalClock extends Component {
	constructor() {
		super();
		this.state = {
			currentTime: new Date(),
		};
	}

	componentDidMount() {
		this.timerID = setInterval(() => {
			this.setState({ currentTime: new Date() });
		}, 1000); // Update every second
	}

	componentWillUnmount() {
		clearInterval(this.timerID);
	}

	render() {
		const { currentTime } = this.state;
		let hours = currentTime.getHours();
		const minutes = currentTime.getMinutes();
		const seconds = currentTime.getSeconds();
		let ampm = 'am'
		if (hours >= 12) {
			ampm = 'pm';
			if (hours > 12) {
				hours -= 12;
			}
			if (hours == 0) {
				hours = 12;
			}
		}

		return (
			<View style={{padding:10, flex: 1, height: 40, flexDirection: 'row'}}>
				<View style={{marginTop: 3}}>
					<Text>Current Time Clock: </Text>
				</View>
				
				<Text style={{fontSize: 18, fontWeight: 'bold'}}>
					{hours < 10 ? '0' : ''}{hours}:
					{minutes < 10 ? '0' : ''}{minutes}:
					{seconds < 10 ? '0' : ''}{seconds}
					{' ' +ampm}
				</Text>
			</View>
		);
	}
}

export default DigitalClock;
