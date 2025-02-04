import React, { useEffect, useState } from 'react';
import { cn } from '@extension/ui';

interface DropdownOption {
  value: string;
  selected: boolean;
}

interface DropdownConfig {
  placeholderIncludes: string;
  count: number;
  options: DropdownOption[];
}

interface IRadioButtonsEntry {
  bgColorByTheme: string;
  textColorByTheme: string;
  isLight: boolean;
}

const RadioButtonsEntry: React.FC<IRadioButtonsEntry> = ({ isLight, bgColorByTheme, textColorByTheme }) => {
  const [radioButtons, setRadioButtons] = useState<DropdownConfig[]>([]);

  useEffect(() => {
    fetchRadioButtonConfigs(setRadioButtons);

    chrome.storage.onChanged.addListener(changes => {
      if ('radioButtons' in changes) {
        setRadioButtons(changes.radioButtons.newValue || []);
      }
    });
  }, []);

  const fetchRadioButtonConfigs = (callback: (data: any) => void) => {
    chrome.storage.local.get('radioButtons', result => {
      callback(result.radioButtons || []);
    });
  };

  const handleRadioChange = (placeholder: string, value: string) => {
    chrome.runtime.sendMessage({
      action: 'updateRadioButtonValueByPlaceholder',
      placeholderIncludes: placeholder,
      newValue: value,
    });
  };

  return (
    <div className="space-y-4">
      {radioButtons.map(config => (
        <div key={config.placeholderIncludes} className={cn('p-4 border rounded-lg', bgColorByTheme)}>
          <h3 className={cn('text-lg font-bold', textColorByTheme)}>{config.placeholderIncludes}</h3>
          <p className={cn('text-sm', textColorByTheme)}>Counter: {config.count}</p>
          <div className="flex gap-4 mt-2">
            {config.options.map(option => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={cn(`radio-${config.placeholderIncludes}`, isLight ? 'bg-slate-50' : 'bg-gray-800')}
                  value={option.value}
                  checked={option.selected}
                  onChange={() => handleRadioChange(config.placeholderIncludes, option.value)}
                  className="w-4 h-4"
                />
                <span className={textColorByTheme}>{option.value}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() =>
              chrome.runtime.sendMessage({ action: 'deleteRadioButtonConfig', data: config.placeholderIncludes })
            }
            className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default RadioButtonsEntry;
