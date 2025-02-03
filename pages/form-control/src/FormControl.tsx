// pages/form-control/src/FormControl.tsx

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { cn } from '@extension/ui';
import DefaultInput from './defaultInput/defaultInput';

const defaultNullFieldInput = {
  YearsOfExperience: '',
  FirstName: '',
  LastName: '',
  PhoneNumber: '',
  City: '',
  Email: '',
};

const FormControl = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';

  const [fields, setFields] = useState<Record<string, string>>(defaultNullFieldInput);
  const [statusMessage, setStatusMessage] = useState('To use Auto Apply, fill out the missing values:');
  const [statusColor, setStatusColor] = useState('text-red-600');

  const loadDefaultFields = () => {
    chrome.storage.local.get('defaultFields', result => {
      const storedFields = result.defaultFields || {};
      if (Object.keys(storedFields).length === 0) {
        chrome.storage.local.set({ defaultFields: defaultNullFieldInput }, () => {
          setFields(defaultNullFieldInput);
          updateStatus(defaultNullFieldInput);
        });
      } else {
        setFields(storedFields);
        updateStatus(storedFields);
      }
    });
  };

  const updateStatus = (fieldsData: Record<string, string>) => {
    const allFilled = Object.values(fieldsData).every(value => value.trim() !== '');
    if (allFilled) {
      setStatusMessage('You are ready to use auto apply!');
      setStatusColor('text-green-700');
    } else {
      setStatusMessage('To use Auto Apply, fill out the missing values:');
      setStatusColor('text-red-600');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFields = { ...fields, [name]: value };
    setFields(newFields);
    updateStatus(newFields);
  };

  const updateConfigDI = (placeholder: string, newValue: string) => {
    return new Promise<void>(resolve => {
      chrome.runtime.sendMessage({ action: 'updateInputFieldValue', data: { placeholder, value: newValue } }, () =>
        resolve(),
      );
    });
  };

  const handleSave = async () => {
    await new Promise<void>(resolve => {
      chrome.storage.local.set({ defaultFields: fields }, () => resolve());
    });

    await updateConfigDI('First name', fields.FirstName);
    await updateConfigDI('Last name', fields.LastName);
    await updateConfigDI('Mobile phone number', fields.PhoneNumber);

    loadDefaultFields();
  };

  useEffect(() => {
    loadDefaultFields();
  }, []);

  return (
    <div className={cn(`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`, 'px-3 py-1 min-h-screen')}>
      {/*  default input fields  */}
      <DefaultInput
        fields={fields}
        isLight={isLight}
        statusMessage={statusMessage}
        statusColor={statusColor}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
      />
    </div>
  );
};

export default withErrorBoundary(withSuspense(FormControl, <div>Loading...</div>), <div>Error Occur</div>);
