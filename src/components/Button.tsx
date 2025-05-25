import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ButtonProps, Button as DefaultButton } from 'react-native';

const Button = (props: ButtonProps) => {
	const { colors } = useTheme();

	return (
		<DefaultButton
			color={colors.primary}
			{...props}
		/>
	);
};

export { Button };
