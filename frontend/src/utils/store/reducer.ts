import { IUserState, UserActions, Constants } from '@/utils/store/types';

// Initialization of store of the state
const initialization: IUserState = {
    user: undefined,
}

export function userReducer(state: IUserState = initialization, action: UserActions): IUserState {

    switch (action.type) {
        case Constants.SAVE_USER:
            return { user: action.payload.user };
        default:
            return state;
    }
}