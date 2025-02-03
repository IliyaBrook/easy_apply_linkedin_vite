// pages/form-control/src/FormControl.tsx
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { cn } from '@extension/ui';

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

  const getInputLabelText = (fieldName: string) => {
    switch (fieldName) {
      case 'YearsOfExperience':
        return 'Years of Experience';
      case 'FirstName':
        return 'First Name';
      case 'LastName':
        return 'Last Name';
      case 'PhoneNumber':
        return 'Phone Number';
      case 'City':
        return 'City';
      case 'Email':
        return 'Email';
      default:
        return fieldName;
    }
  };

  useEffect(() => {
    loadDefaultFields();
  }, []);

  return (
    <div className={cn(`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`, 'px-3 py-1 min-h-screen')}>
      <header className={`${isLight ? 'text-gray-900' : 'text-gray-100'} text-center mb-6`}>
        <h1 className="text-3xl font-bold mb-2">Required Personal Info</h1>
        <h2 id="status-message" className={`${statusColor} text-xl`}>
          {statusMessage}
        </h2>
      </header>
      <section id="input-fields" className="space-y-4">
        {Object.keys(fields).map(fieldName => (
          <div key={fieldName} className="mb-4">
            <label className="block mb-1 font-bold text-base">{getInputLabelText(fieldName)}</label>
            <input
              type="text"
              name={fieldName}
              value={fields[fieldName]}
              onChange={handleInputChange}
              className={`w-full p-2 border-2 rounded ${
                !fields[fieldName].trim() ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
        ))}
      </section>
      <button
        id="save-button"
        onClick={handleSave}
        className="block mx-auto mt-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 px-6 rounded text-lg">
        Save
      </button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(FormControl, <div>Loading...</div>), <div>Error Occur</div>);
