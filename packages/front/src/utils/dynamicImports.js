import { lazy } from 'react';

const getCodeChunk = (dynamicImport, fallbackUrl) =>
  new Promise(resolve => {
    dynamicImport()
      .then(resolve)
      .catch(() => {
        window.location.pathname = fallbackUrl || '/';
      });
  });

const dynamicImportComponent = (dynamicImport, fallbackUrl) =>
  lazy(() => getCodeChunk(dynamicImport, fallbackUrl));

export default dynamicImportComponent;
