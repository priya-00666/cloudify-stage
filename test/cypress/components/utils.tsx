import React, { ReactNode } from 'react';
import { mount } from '@cypress/react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';

import createRootReducer from 'app/reducers';

// eslint-disable-next-line import/prefer-default-export
export function mountWithProvider(component: ReactNode, initialState?: Record<string, any>) {
    const history = createBrowserHistory();
    const store = createStore(
        createRootReducer(history),
        initialState,
        applyMiddleware(thunkMiddleware, routerMiddleware(history))
    );
    mount(<Provider store={store}>{component}</Provider>);
    return store;
}