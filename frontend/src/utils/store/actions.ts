import { action } from 'typesafe-actions';
import { Constants } from './types';

import { User } from '@/classes/User';

export function saveUser(user: User) {
    return action(Constants.SAVE_USER, {
        user
    });
}

export function logoutUser() {
    return action(Constants.LOGOUT_USER, {});
}