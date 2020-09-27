import React, { Suspense } from 'react';
import { ConnectedRouter } from 'connected-react-router';

import Home from '~screens/Home';
import { history } from '~redux/store';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import styles from './styles.module.scss';

const AppRoutesContainer = () => (
  <ConnectedRouter history={history}>
    <div className={`column ${styles.container}`}>
      <Suspense>
        <AuthenticatedRoute path="/" component={Home} />
      </Suspense>
    </div>
  </ConnectedRouter>
);

export default AppRoutesContainer;
