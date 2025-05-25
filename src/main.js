import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OverlayScreen from './screens/OverlayScreen';
import { ListCategoriesScreen } from './screens/ListCategories';
import { ListTransactions } from './screens/ListTransactions';
import {IconSvg, IconNames} from './components/IconSvg';

const Tab = createBottomTabNavigator();

export function MainApp() {

    function get_tab_options(label='', icon_name='', rest={}) {
        let res_options = {
            title: label,
            tabBarShowLabel: true,
            tabBarLabel: label,
            tabBarIcon: () => (<IconSvg name={icon_name} />),
            tabBarIconStyle: { border: 1 }
        }
        return res_options;
    }

    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName='Transactions'>
                <Tab.Screen name='Categories' component={ListCategoriesScreen} options={{
                    tabBarIcon: () => (<IconSvg name={IconNames.group} />),
                    tabBarLabel: 'Categories',
                    title: 'Categories List',
                }}/>                
                <Tab.Screen name='Transactions' component={ListTransactions} options={{
                    tabBarLabel: 'Transactions',
                    tabBarIcon: () => (<IconSvg name={IconNames.bank} />),
                    title: 'Transactions List',
                }}/>
                <Tab.Screen name='OverlayScreen' component={OverlayScreen} options={get_tab_options('Overlay', IconNames.image)}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
