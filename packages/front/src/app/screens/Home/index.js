import React, { useState } from 'react';
import i18next from 'i18next';

import SideBar from '~components/SideBar';

import CodeEditor from './components/CodeEditor';
import ExerciseDescription from './components/ExerciseDescription';
import { FUNDAMENTALS_TOPICS_EXERCISES, INITIAL_TOPIC } from './constants';
import styles from './styles.module.scss';

function Home() {
  const [topic] = useState(INITIAL_TOPIC);
  const { description, exercise, title } = FUNDAMENTALS_TOPICS_EXERCISES[topic];
  return (
    <div className="row full-width">
      <SideBar />
      <div className="column middle center full-width">
        <span className="text-uppercase text-mid-gray m-bottom-2">{i18next.t('Home:title')}</span>
        <div className={styles.homeContainer}>
          <ExerciseDescription
            className="m-bottom-4"
            description={description}
            exercise={exercise}
            title={title}
          />
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}

export default Home;
