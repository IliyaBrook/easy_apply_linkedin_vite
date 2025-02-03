import React from 'react';

interface IDefaultInputProps {
  fields: Record<string, string>;
  isLight: boolean;
  statusMessage: string;
  statusColor: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

const DefaultInput: React.FC<IDefaultInputProps> = ({
  fields,
  handleInputChange,
  handleSave,
  statusMessage,
  statusColor,
  isLight,
}) => {
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

  return (
    <div>
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

export default DefaultInput;
