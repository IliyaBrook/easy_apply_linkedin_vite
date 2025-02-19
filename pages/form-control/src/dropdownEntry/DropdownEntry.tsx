import React, { useEffect, useState } from 'react';
import { cn } from '@extension/ui';

interface IDropDownOptions {
  value: string;
  selected: boolean;
}

interface IDropDown {
  placeholderIncludes: string;
  count: number;
  options: IDropDownOptions[];
}

interface DropdownsEntryProps {
  isLight: boolean;
  bgColorByTheme: string;
  textColorByTheme: string;
}

const DropdownsEntry: React.FC<DropdownsEntryProps> = ({ isLight }) => {
  const [dropdowns, setDropdowns] = useState<IDropDown[]>([]);

  useEffect(() => {
    fetchDropdownConfigs(setDropdowns);

    chrome.storage.onChanged.addListener(changes => {
      if ('dropdowns' in changes) {
        setDropdowns(changes.dropdowns.newValue || []);
      }
    });
  }, []);

  const fetchDropdownConfigs = (callback: (data: any) => void) => {
    chrome.storage.local.get('dropdowns', result => {
      callback(result.dropdowns || []);
    });
  };

  const handleDropdownChange = (placeholder: string, value: string) => {
    chrome.runtime.sendMessage({
      action: 'updateDropdownConfig',
      data: { placeholderIncludes: placeholder, value },
    });
  };

  return (
    <div className="space-y-4">
      {dropdowns.map(config => (
        <div
          key={config.placeholderIncludes}
          className={cn('p-4 border rounded-lg', isLight ? 'bg-white' : 'bg-gray-700')}>
          <h3 className="text-lg font-bold">{config.placeholderIncludes}</h3>
          <p className="text-sm text-gray-500">Counter: {config.count}</p>
          <select
            onChange={e => handleDropdownChange(config.placeholderIncludes, e.target.value)}
            defaultValue={config.options.find(opt => opt.selected)?.value || ''}
            className="w-full p-2 border rounded">
            {config.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              chrome.runtime.sendMessage({ action: 'deleteDropdownConfig', data: config.placeholderIncludes })
            }
            className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default DropdownsEntry;
