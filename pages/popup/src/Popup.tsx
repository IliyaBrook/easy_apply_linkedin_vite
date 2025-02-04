import '@src/Popup.css';
import { navigate, useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { cn, ToggleThemeButton } from '@extension/ui';
import Swal from 'sweetalert2';

const Popup = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';
  const borderStyle = 'border border-gray-400 p-2 mb-4 rounded w-[100%] flex flex-col gap-4';
  const buttonsStyle = 'flex items-center p-2 rounded  drop-shadow w-full justify-center ';
  const imgStyle = 'w-5';

  const handleExport = () => {
    chrome.storage.local.get(null, data => {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      link.download = `autoapply_settings_${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}.json`;
      link.click();

      URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'Export Successful',
        text: 'Settings have been exported successfully!',
      });
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.addEventListener('change', (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          chrome.storage.local.set(importedData, () => {
            Swal.fire({
              icon: 'success',
              title: 'Import Successful',
              text: 'Settings have been imported successfully!',
            });
          });
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Import Failed',
            text: 'Error parsing JSON file. Please check the file format.',
          });
        }
      };
      reader.readAsText(file);
    });

    input.click();
  };

  return (
    <div className={cn(`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`, 'px-3 py-1')}>
      <header className={`${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <div className="flex justify-center">
          <ToggleThemeButton theme={theme} toggle={themeStorage.toggle}>
            Toggle Theme
          </ToggleThemeButton>
        </div>
        <div className="">
          <div className={cn(borderStyle)}>
            <button
              onClick={() => navigate('form-control/index.html')}
              className={cn(buttonsStyle, `bg-green-400 hover:bg-green-500`)}>
              <img src={chrome.runtime.getURL('icons/gear-solid.svg')} alt="Gear icon" className={imgStyle} />
              <span className="ml-5">Form control</span>
            </button>
            <button
              onClick={() => navigate('filter-settings/index.html')}
              className={cn(buttonsStyle, `bg-violet-400 hover:bg-violet-500`)}>
              <img
                src={chrome.runtime.getURL('icons/arrow-up-right-from-square-solid.svg')}
                alt="Gear icon"
                className={imgStyle}
              />
              <span className="ml-5">Filter settings</span>
            </button>
            <button
              className={cn(buttonsStyle, `bg-red-400 hover:bg-red-500`)}
              onClick={() => navigate('personal-info/index.html')}>
              <img src={chrome.runtime.getURL('icons/filter-solid.svg')} alt="Gear icon" className={imgStyle} />
              <span className="ml-5">Personal info</span>
            </button>
            <button
              className={cn(buttonsStyle, `bg-blue-400 hover:bg-blue-500`)}
              onClick={() => navigate('external-apply/index.html')}>
              <img src={chrome.runtime.getURL('icons/user-regular.svg')} alt="Gear icon" className={imgStyle} />
              <span className="ml-4">External apply</span>
            </button>
            <button
              className={cn(buttonsStyle, `bg-blue-400 hover:bg-blue-500`)}
              onClick={() => navigate('new-tab/index.html')}>
              <img src={chrome.runtime.getURL('icons/user-regular.svg')} alt="Gear icon" className={imgStyle} />
              <span className="ml-4">Test tab new page</span>
            </button>
          </div>
          <div className={cn(borderStyle)}>
            <button className={cn(buttonsStyle, `bg-yellow-400 hover:bg-yellow-500`)} onClick={handleExport}>
              <img src={chrome.runtime.getURL('icons/file-export-solid.svg')} alt="Gear icon" className={imgStyle} />
              <span className="ml-2">Export settings</span>
            </button>
            <button className={cn(buttonsStyle, `bg-blue-400 hover:bg-blue-500`)} onClick={handleImport}>
              <img src={chrome.runtime.getURL('icons/file-import-solid.svg')} alt="Gear icon" className={imgStyle} />
              <span className="ml-4">Import settings</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
