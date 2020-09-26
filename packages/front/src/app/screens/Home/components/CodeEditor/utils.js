import { convertToRaw } from 'draft-js';

import { CODE_STATUS } from './constants';

export const getCodeFromEditor = value => {
  const { blocks } = convertToRaw(value.getCurrentContent());
  return blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
};

export const getCodeExecution = code => {
  let result = '';
  try {
    result = eval(code);
  } catch (e) {
    return {
      result: e.message,
      status: CODE_STATUS.ERROR
    };
  }
  return {
    result,
    status: CODE_STATUS.SUCCESS
  };
};
