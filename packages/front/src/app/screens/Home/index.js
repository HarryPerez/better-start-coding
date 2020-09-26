import React, { useState } from 'react';
import i18next from 'i18next';

import CodeEditor from './components/CodeEditor';
import ExerciseDescription from './components/ExerciseDescription';
import { FUNDAMENTALS_TOPICS_EXERCISES, INITIAL_TOPIC } from './constants';
import styles from './styles.module.scss';

function Home() {
  const [topic] = useState(INITIAL_TOPIC);
  const { description, exercise, title } = FUNDAMENTALS_TOPICS_EXERCISES[topic];
  return (
    <div className={`column center ${styles.homeContainer}`}>
      <span className="text-uppercase text-mid-gray m-bottom-2">{i18next.t('Home:title')}</span>
      <ExerciseDescription
        className="m-bottom-4"
        description={description}
        exercise={exercise}
        title={title}
      />
      <CodeEditor />
    </div>
  );
}

export default Home;
