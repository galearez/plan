import { useContext } from 'react';
import { ThemeContext } from './theme-context';

import clsx from 'clsx';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';

//TO IMPLEMENT: fields for links to contribute, license, and all the things that will be needed in the future

//This component is the side menu to change the site settings and also links to the license and how to contribute
export default function SideMenu(props: any) {
  //Values to change the theme from the sidemenu
  let { theme, setTheme } = useContext(ThemeContext);

  //this variable control the width of the menu, to show it when the user open the menu, it's purpose is to
  //create a smooth transition
  const open = props.open;

  //This is a callback meant to close this menu, when the use prees the button to close inside this component
  const closeMenu = props.closeMenu;

  //the return value of this function will control the switch of the dark mode
  function darkTheme(): boolean {
    return theme === 'dark';
  }

  return (
    <div
      className={clsx(
        'h-screen w-0 absolute -top-2 -right-2 bg-gray-50 dark:bg-gray-900 overflow-x-hidden transition-width duration-500 ease-out z-20',
        open && 'w-screen md:w-80'
      )}
    >
      {/* Min width set around 320px, that way it will not shrink when close */}
      <div className='p-2'>
        {/* Nav bar of the site menu */}
        <div className='w-full min-w-19 h-10 flex justify-between items-center text-xl font-semibold'>
          <span>Settings</span>
          <span
            className='w-8 h-8 flex justify-center items-center'
            onClick={() => closeMenu(false)}
          >
            <CloseIcon className='w-7 h-7 fill-current text-gray-900 dark:text-gray-50' />
          </span>
        </div>
        <hr className='my-2' />
        {/* Dark theme toggle switch */}
        <div className='w-full min-w-19 my-3'>
          <div className='flex justify-between items-center'>
            Dark theme
            <span
              className='toggle-switch'
              onClick={() => {
                setTheme(darkTheme() ? '' : 'dark');
              }}
            >
              <input
                type='checkbox'
                onChange={() => darkTheme()}
                checked={theme === 'dark'}
              />
              <span className='slider'></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
