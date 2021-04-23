import { ActionType } from 'typesafe-actions';

import * as actions from '@/utils/store/actions';
import { User } from '@/classes/User';

export interface IUserState {
    user: User | undefined,
}

export enum Constants {
    SAVE_USER = 'SAVE_USER',
    LOGOUT_USER = 'LOGOUT_USER',
}

export type UserActions = ActionType<typeof actions>;