import React from 'react';
import i18next from 'i18next';
import cn from 'classnames';
import { string, bool, func } from 'prop-types';

import { SIDEBAR_ITEMS } from '../../constants';

import styles from './styles.module.scss';

function SideBarItem({ isSelected, item, onClick }) {
  const handleClick = () => {
    onClick(item);
  };
  return (
    <div
      key={item}
      className={cn(
        'row middle full-width',
        { [styles.sideBarItemSelected]: isSelected },
        { [styles.sideBarItemNotSelected]: !isSelected }
      )}
      onClick={handleClick}>
      {isSelected && <div className={styles.selectedItem} />}
      <span className={cn('text-uppercase', styles.sideBarText)}>
        {i18next.t(`SideBarItem:${SIDEBAR_ITEMS[item]}`)}
      </span>
    </div>
  );
}

SideBarItem.propTypes = {
  item: string.isRequired,
  onClick: func.isRequired,
  isSelected: bool
};

export default SideBarItem;
