import React from 'react';

import styles from './styles.module.scss';

const Navbar = () => (
  <nav id="navbarTop" className={`row end ${styles.navBar}`}>
    <button type="button" className={`row middle ${styles.logout}`}>
      <i className="icon-logout m-right-2" />
    </button>
  </nav>
);
export default Navbar;
