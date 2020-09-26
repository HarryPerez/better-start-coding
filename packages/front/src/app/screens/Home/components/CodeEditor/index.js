import React, { useState } from 'react';
import i18next from 'i18next';
import { object } from 'prop-types';
import { Editor, EditorState } from 'draft-js';
import { useToasts } from 'react-toast-notifications';
import 'draft-js/dist/Draft.css';

import { getCodeFromEditor, getCodeExecution } from './utils';
import { CODE_STATUS } from './constants';
import styles from './styles.module.scss';

function CodeEditor({ conditions }) {
  const { addToast } = useToasts();
  const makeEditorEmpty = () => EditorState.createEmpty();
  const [code, setCode] = useState(makeEditorEmpty);

  const showCodeExecutionResult = ({ result, status }) => {
    if (status === CODE_STATUS.ERROR) {
      addToast(`${i18next.t('CodeEditor:error')} ${result}`, {
        appearance: CODE_STATUS.ERROR,
        autoDismiss: true
      });
    } else {
      addToast(`${i18next.t('CodeEditor:success')} ${result || ''}`, {
        appearance: CODE_STATUS.SUCCESS,
        autoDismiss: true
      });
    }
  };

  const onHandleRun = () => {
    const editorCode = getCodeFromEditor(code);
    const executionResponse = getCodeExecution(editorCode, conditions);
    showCodeExecutionResult(executionResponse);
  };

  return (
    <div className="column">
      <div className={styles.editorContainer}>
        <Editor editorState={code} onChange={setCode} />
      </div>
      <button className={`full-width ${styles.editorButton}`} type="button" onClick={onHandleRun}>
        <span className="text-uppercase text-mid-gray">{i18next.t('CodeEditor:run')}</span>
      </button>
    </div>
  );
}

CodeEditor.propTypes = {
  conditions: object
};

export default CodeEditor;
