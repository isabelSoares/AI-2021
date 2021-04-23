import { combineReducers, createStore } from 'redux';
import { userReducer } from '@/utils/store/reducer';
import { IUserState} from '@/utils/store/types';

export interface IRootState {
    user_reducer: IUserState,
}

const store = createStore<IRootState, any, any, any>(
    combineReducers({
        user_reducer: userReducer,
    })
);

export default store;