import { ReactComponent as AddIcon } from '../assets/icons/add.svg';
import { ReactComponent as MoreVertIcon } from '../assets/icons/more-vert.svg';
import { ReactComponent as ArrowBackIcon } from '../assets/icons/arrow-back.svg';
import { ReactComponent as MenuIcon } from '../assets/icons/menu.svg';
import { ReactComponent as NotebookIcon } from '../assets/icons/notebook.svg';
import { ReactComponent as CheckListIcon } from '../assets/icons/check-list.svg';

import clsx from 'clsx';

//this component return only the needed svg icon, it will help with maintaining
export function icons(icon: string, additional?: string) {
  const defaultStyle = 'fill-current text-gray-900 dark:text-gray-50';

  switch (icon) {
    case 'add':
      return <AddIcon className={clsx(defaultStyle, additional)} />;
    case 'more':
      return <MoreVertIcon className={clsx(defaultStyle, additional)} />;
    case 'back':
      return <ArrowBackIcon className={clsx(defaultStyle, additional)} />;
    case 'menu':
      return <MenuIcon className={clsx(defaultStyle, additional)} />;
    case 'notebook':
      return (
        <NotebookIcon
          className={clsx('fill-current text-gray-50', additional)}
        />
      );
    case 'todo':
      return (
        <CheckListIcon
          className={clsx('fill-current text-gray-50', additional)}
        />
      );
  }
}
