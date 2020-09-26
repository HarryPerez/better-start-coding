import React from 'react';
import i18next from 'i18next';

import CodeEditor from './components/CodeEditor';

function Home() {
  return (
    <div className="column center">
      <span className="text-uppercase m-bottom-2">{i18next.t('Home:title')}</span>
      <CodeEditor />
    </div>
  );
}

export default Home;
