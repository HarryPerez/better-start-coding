import React, { useState } from 'react';
import cn from 'classnames';

import SideBarItem from './components/SideBarItem';
import { SIDEBAR_ITEMS, DEFAULT_ITEM } from './constants';
import styles from './styles.module.scss';

function SideBar() {
  const [selected, setSelected] = useState(DEFAULT_ITEM);
  return (
    <div className={cn('column', styles.sideBarContainer)}>
      {Object.keys(SIDEBAR_ITEMS).map(item => (
        <SideBarItem onClick={setSelected} isSelected={item === selected} key={item} item={item} />
      ))}
    </div>
  );
}

export default SideBar;
