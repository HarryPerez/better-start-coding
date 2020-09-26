import React, { Suspense } from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Route } from 'react-router-dom';

import Home from '~screens/Home';
import { history } from '~redux/store';

import styles from './styles.module.scss';

const AppRoutesContainer = () => (
  <ConnectedRouter history={history}>
    <div className={`column center ${styles.container} ${styles.containerAlgo}`}>
      <Suspense>
        <Route path="/" component={Home} />
      </Suspense>
    </div>
  </ConnectedRouter>
);

export default AppRoutesContainer;
