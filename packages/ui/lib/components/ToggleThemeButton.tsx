import type React from 'react';
import { type ComponentPropsWithoutRef } from 'react';

interface IToggleThemeButton extends ComponentPropsWithoutRef<'button'> {
  theme: 'light' | 'dark';
  toggle: () => Promise<void>;
  children: React.ReactNode;
}

export const ToggleThemeButton: React.FC<IToggleThemeButton> = ({ theme, className, toggle, children }) => {
  return (
    <button
      className={
        className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black shadow-black' : 'bg-black text-white')
      }
      onClick={toggle}>
      {children}
    </button>
  );
};
