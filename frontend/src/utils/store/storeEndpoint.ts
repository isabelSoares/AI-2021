import { Dispatch } from 'redux';

import { IRootState } from '@/utils/store/store';
import * as actions from '@/utils/store/actions';
import { UserActions } from '@/utils/store/types';

// ======================== Needed Classes ========================
import {User, load_user} from '@/classes/User';

export const mapStateToProps = ({ user_reducer }: IRootState) => {
    const { user } = user_reducer;
    return { user };
}

export const mapDispatcherToProps = (dispatch: Dispatch<UserActions>) => {
    return {
        saveUser: (user: User) => dispatch(actions.saveUser(user)),
        logoutUser: () => dispatch(actions.logoutUser())
    }
}

export type ReduxType = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatcherToProps>;