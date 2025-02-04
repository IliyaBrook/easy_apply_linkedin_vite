// pages/form-control/src/FormControl.tsx

import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { cn } from '@extension/ui';
import RadioButtonFields from '@src/radioButtonFields/RadioButtonFields';
import DropDownFields from '@src/dropdownEntry/DropdownEntry';
import React from 'react';
import TextFields from '@src/textFields/TextFields';
import './index.css';

const FormControl = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';
  const textColorByTheme = isLight ? 'text-gray-700' : 'text-gray-100';
  const bgColorByTheme = isLight ? 'bg-slate-50' : 'bg-gray-700';

  return (
    <div className={cn(`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`, 'px-6 py-4 min-h-screen')}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cn('shadow-lg rounded-lg p-4', bgColorByTheme)}>
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Text Fields Entry</h2>
          <TextFields isLight={isLight} bgColorByTheme={bgColorByTheme} textColorByTheme={textColorByTheme} />
        </div>
        {/*  Radio input fields  */}
        <div className={cn('shadow-lg rounded-lg p-4', bgColorByTheme)}>
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Radio Buttons Entry</h2>
          <RadioButtonFields isLight={isLight} textColorByTheme={textColorByTheme} bgColorByTheme={bgColorByTheme} />
        </div>
        {/* Drop down fields */}
        <div className={cn('shadow-lg rounded-lg p-4', bgColorByTheme)}>
          <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Dropdowns Entry</h2>
          <DropDownFields isLight={isLight} bgColorByTheme={bgColorByTheme} textColorByTheme={textColorByTheme} />
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(FormControl, <div>Loading...</div>), <div>Error Occur</div>);
