import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';

import store from '~redux/store';

import Routes from './components/Routes';

const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);

export default hot(App);
