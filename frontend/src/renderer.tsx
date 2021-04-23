import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/app/app';

// Dealing with store
import { Provider } from 'react-redux';
import store from '@/utils/store/store';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);