// pages/form-control/src/FormControl.tsx

import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { cn } from '@extension/ui';
import RadioButtonFields from '@src/radioButtonFields/RadioButtonFields';
import DropDownFields from '@src/radioButtonsEntry/RadioButtonsEntry';
import React from 'react';
import DefaultInput from './defaultInput/defaultInput';
import './index.css';

const FormControl = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';

  return (
    <div className={cn(`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`, 'px-6 py-4 min-h-screen')}>
      {/*  Default input fields  */}
      {/* every 3 columns */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Text Fields Entry</h2>
          <DefaultInput isLight={isLight} />
        </div>
        {/*  Radio input fields  */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Radio Buttons Entry</h2>
          <RadioButtonFields isLight={isLight} />
        </div>
        {/* Drop down fields */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Dropdowns Entry</h2>
          <DropDownFields isLight={isLight} />
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(FormControl, <div>Loading...</div>), <div>Error Occur</div>);
