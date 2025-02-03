import { cn } from '@/lib/utils';
import type React from 'react';

export type IToggleThemeButton = {
  theme?: 'light' | 'dark';
} & React.ComponentPropsWithoutRef<'button'>;

const notificationOptions = {
  type: 'basic',
  iconUrl: chrome.runtime.getURL('icon-34.png'),
  title: 'Injecting content script error',
  message: 'You cannot inject script here!',
} as const;

export const ToggleThemeButton: React.FC<IToggleThemeButton> = ({ theme, className, children }): React.ReactElement => {
  const injectContentScript = async () => {
    const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });

    if (tab.url!.startsWith('about:') || tab.url!.startsWith('chrome:')) {
      chrome.notifications.create('inject-error', notificationOptions);
    }

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ['/content-runtime/index.iife.js'],
      })
      .catch(err => {
        // Handling errors related to other paths
        if (err.message.includes('Cannot access a chrome:// URL')) {
          chrome.notifications.create('inject-error', notificationOptions);
        }
      });
  };
  return (
    <button
      className={cn(
        className,
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ',
        theme === 'light' ? 'bg-blue-200 text-black' : 'bg-gray-700 text-white',
      )}
      onClick={injectContentScript}>
      {children}
    </button>
  );
};

export default ToggleThemeButton;
