import React, { ChangeEvent, useEffect, useState } from 'react';

const defaultNullFieldInput = {
  YearsOfExperience: '',
  FirstName: '',
  LastName: '',
  PhoneNumber: '',
  City: '',
  Email: '',
};

interface InputFieldConfig {
  placeholderIncludes: string;
  defaultValue: string;
  count: number;
}

const DefaultInput: React.FC<{ isLight: boolean }> = ({ isLight }) => {
  const [fields, setFields] = useState<Record<string, string>>(defaultNullFieldInput);
  const [statusMessage, setStatusMessage] = useState('To use Auto Apply, fill out the missing values:');
  const [statusColor, setStatusColor] = useState('text-red-600');
  const [additionalFields, setAdditionalFields] = useState<InputFieldConfig[]>([]);

  const loadDefaultFields = () => {
    chrome.storage.local.get(['defaultFields', 'inputFieldConfigs'], result => {
      const storedFields = result.defaultFields || {};
      setFields(storedFields);

      const configs: InputFieldConfig[] = result.inputFieldConfigs || [];
      setAdditionalFields(configs);

      updateStatus(storedFields, configs);
    });
  };

  const updateStatus = (fieldsData: Record<string, string>, additionalConfigs: InputFieldConfig[]) => {
    const allFieldsFilled = Object.values(fieldsData).every(value => value.trim() !== '');
    const allAdditionalFieldsFilled = additionalConfigs.every(config => config.defaultValue.trim() !== '');

    if (allFieldsFilled && allAdditionalFieldsFilled) {
      setStatusMessage('All fields are filled. You are ready to apply!');
      setStatusColor('text-green-700');
    } else {
      setStatusMessage('Please fill in all fields for better job applications.');
      setStatusColor('text-red-600');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields(prev => {
      const newFields = { ...prev, [name]: value };
      updateStatus(newFields, additionalFields);
      return newFields;
    });
  };

  const updateConfigDI = (placeholder: string, newValue: string) => {
    return new Promise<void>(resolve => {
      chrome.runtime.sendMessage({ action: 'updateInputFieldValue', data: { placeholder, value: newValue } }, () =>
        resolve(),
      );
    });
  };

  const handleAdditionalInputChange = (e: ChangeEvent<HTMLInputElement>, placeholder: string) => {
    const newValue = e.target.value;
    setAdditionalFields(prev =>
      prev.map(field => (field.placeholderIncludes === placeholder ? { ...field, defaultValue: newValue } : field)),
    );
  };

  const handleSave = async () => {
    await new Promise<void>(resolve => {
      chrome.storage.local.set({ defaultFields: fields }, () => resolve());
    });

    await Promise.all([
      updateConfigDI('First name', fields.FirstName),
      updateConfigDI('Last name', fields.LastName),
      updateConfigDI('Mobile phone number', fields.PhoneNumber),
    ]);

    await Promise.all(additionalFields.map(field => updateConfigDI(field.placeholderIncludes, field.defaultValue)));

    loadDefaultFields();
  };

  useEffect(() => {
    loadDefaultFields();
  }, []);

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

  const save: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> = {
    onBlur: () => {
      void handleSave();
    },
    onKeyDown: e => {
      if (e.key === 'Enter') {
        void handleSave();
      }
    },
  };

  return (
    <div>
      <header className={`${isLight ? 'text-gray-900' : 'text-gray-100'} text-center mb-6`}>
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
              {...save}
            />
          </div>
        ))}
        {additionalFields.map(config => (
          <div key={config.placeholderIncludes} className="mb-4">
            <label className="block mb-1 font-bold text-base">{config.placeholderIncludes}</label>
            <input
              onBlur={() => {
                handleSave();
              }}
              type="text"
              value={config.defaultValue}
              onChange={e => handleAdditionalInputChange(e, config.placeholderIncludes)}
              className={`w-full p-2 border-2 rounded ${!config.defaultValue.trim() ? 'border-red-500' : 'border-gray-300'}`}
              {...save}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default DefaultInput;
