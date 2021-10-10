//since we have some icons I thought it would be better to group the related ones in a component
//that way the code where we need them would look cleanear

import { ReactComponent as BoldIcon } from '../../assets/icons/format-bold.svg';
import { ReactComponent as ItalicIcon } from '../../assets/icons/format-italic.svg';
import { ReactComponent as UnderlinedIcon } from '../../assets/icons/format-underlined.svg';
import { ReactComponent as CodeIcon } from '../../assets/icons/code.svg';
import { ReactComponent as HeadingOneIcon } from '../../assets/icons/heading-one.svg';
import { ReactComponent as HeadingTwoIcon } from '../../assets/icons/heading-two.svg';
import { ReactComponent as NumberedListIcon } from '../../assets/icons/numbered-list.svg';
import { ReactComponent as BulletedListIcon } from '../../assets/icons/bulleted-list.svg';
import { ReactComponent as CheckBoxIcon } from '../../assets/icons/check-box.svg';
import { ReactComponent as QuoteIcon } from '../../assets/icons/quote.svg';
import { ReactComponent as ImageIcon } from '../../assets/icons/image.svg';
import clsx from 'clsx';

//this component return only the needed component, and a simple state to highligth it
export default function icons(icon: string, active: boolean) {
  const color = active
    ? 'text-gray-900 dark:text-gray-50'
    : 'text-gray-400 hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-600';

  switch (icon) {
    case 'bold':
      return <BoldIcon className={clsx('fill-current', color)} />;
    case 'italic':
      return <ItalicIcon className={clsx('fill-current', color)} />;
    case 'underlined':
      return <UnderlinedIcon className={clsx('fill-current', color)} />;
    case 'code':
      return <CodeIcon className={clsx('fill-current', color)} />;
    case 'h1':
      return <HeadingOneIcon className={clsx('fill-current', color)} />;
    case 'h2':
      return <HeadingTwoIcon className={clsx('fill-current', color)} />;
    case 'ol':
      return <NumberedListIcon className={clsx('fill-current', color)} />;
    case 'ul':
      return <BulletedListIcon className={clsx('fill-current', color)} />;
    case 'check':
      return <CheckBoxIcon className={clsx('fill-current', color)} />;
    case 'quote':
      return <QuoteIcon className={clsx('fill-current', color)} />;
    case 'image':
      return (
        <ImageIcon className='fill-current text-gray-400 hover:text-gray-300 dark:text-gray-500 dark:hover:text-gray-600' />
      );
  }
}
