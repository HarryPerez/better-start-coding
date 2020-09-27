import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';

import store from '~redux/store';

import Routes from './components/Routes';

const App = () => (
  <Provider store={store}>
    <ToastProvider>
      <Routes />
    </ToastProvider>
  </Provider>
);

export default hot(App);
