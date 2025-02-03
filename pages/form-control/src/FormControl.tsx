// pages/form-control/src/FormControl.tsx

import DropdownsEntry from '@src/dropdownsEntry/DropdownsEntry';
import RadioButtonsEntry from '@src/dropdownsEntry/DropdownsEntry';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { cn } from '@extension/ui';
import DefaultInput from './defaultInput/defaultInput';

const FormControl = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';

  return (
    <div className={cn(`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`, 'px-3 py-1 min-h-screen')}>
      {/*  Default input fields  */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Text Fields Entry</h2>
        <DefaultInput isLight={isLight} />
      </div>
      {/*  Radio input fields  */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Radio Buttons Entry</h2>
        <RadioButtonsEntry isLight={isLight} />
      </div>
      {/* Drop down fields */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Dropdowns Entry</h2>
        <DropdownsEntry isLight={isLight} />
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(FormControl, <div>Loading...</div>), <div>Error Occur</div>);
