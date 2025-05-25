import { NavigationProp } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

export interface PropsType {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
    defaultDateFrom?: Date;
}

export interface BaseState {
    data_loading: string;
    objects_list: any[],
    editMode: number,
    showChildren: boolean
}

export interface PaginationType {
    offset: number,
    record_count: number,
    per_page: number
}


