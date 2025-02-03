import '@src/ExternalApply.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { cn } from '@extension/ui';

const ExternalApply = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';
  return (
    <div className={cn(`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`, 'px-3 py-1')}>
      <header className={`${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
        <h1>External apply page</h1>
      </header>
    </div>
  );
};

export default withErrorBoundary(withSuspense(ExternalApply, <div> Loading ... </div>), <div> Error Occur </div>);
