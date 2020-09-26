import React from 'react';
import cn from 'classnames';
import { string } from 'prop-types';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router';

import styles from './styles.module.scss';

const AuthenticatedRoute = ({ title, description, path, ...props }) => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
    <div className={cn(styles.containerSite, 'item-1')}>
      <div className={`column full-width center ${styles.mainContent}`}>
        <Route path={path} {...props} />
      </div>
    </div>
  </>
);

AuthenticatedRoute.propTypes = {
  path: string.isRequired,
  description: string,
  title: string
};

export default withRouter(AuthenticatedRoute);
