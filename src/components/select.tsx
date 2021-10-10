import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
//icon
import { ReactComponent as DropDownIcon } from '../assets/icons/drop-down.svg';

//Custom select props
interface ICustomSelect {
  elements: any[]; //any array of elements which must contain a value called value
  button?: () => void; //optional method to inlude a button that trigger some function inside the select box
  selected?: (v: any) => void; //This method is a callback which send the selected value to the parent component, then we can process their data
  //TO IMPLEMENT: add a new prop, this will change the text inside the buttons in the select box to create a new folder
}

//Custom select box component
export default function CustomSelect(props: ICustomSelect) {
  const elements = props.elements;
  let [value, setValue] = useState(elements[0].label); //selected value
  let [openList, setOpenList] = useState(false); //value's list
  let [optionIndex, setOptionIndex] = useState<number>(0); //index of the current value for arrow navigation

  //TO IMPLEMENT: instead of use a string value (label) we will use the uuid
  //Callback to set the selected value when user click on element in the select list
  let selectedValue = useCallback(
    (v: string) => {
      if (v !== value) {
        setValue(v);
        props.selected?.(v);
        setOpenList(false);
        return;
      }

      setOpenList(false);
    },
    [value, props]
  );

  const options = elements.map(({ id, label }: any) => (
    <Options key={id} id={id} value={label} selectedValue={selectedValue} />
  ));

  //Lenght of the elements in the select list
  const optionsLength = elements.length;

  //This two following functions are useful for keyboard navigation
  //This function will set the index of the current value
  useEffect(() => {
    let temp = elements.findIndex((elem: any) => {
      return elem.label === value; //when true return the elem index
    });

    setOptionIndex(temp); //will assing the currrent value index (stored in temp)
  }, [value, elements]);

  //This function will change the selected value, only if the index is lower than the elements array of objects length
  useEffect(() => {
    //emergency condition, it should never be evaluated to true but if something goes wrong it will not cause any kind of memory leaking
    let elem = elements[optionIndex];

    if (optionIndex >= optionsLength) {
      return;
    }

    setValue(elem.label);
  }, [optionIndex, elements, optionsLength]);

  return (
    <div className='relative w-52 h-full'>
      <div className='h-full rounded-md w-60'></div>
      <div
        className={clsx(
          'custom-select w-60 sm:w-64 md:w-72 border-2 border-gray-50 dark:border-gray-900 rounded-md absolute top-0 outline-none focus:ring-2 hover:ring-2 ring-sky-600 z-10'
        )}
        tabIndex={0}
        onBlur={() => setOpenList(false)}
        onKeyDown={(e) => {
          if (e.code === 'Space') {
            e.preventDefault();
            setOpenList(true);
            return;
          }

          switch (e.code) {
            case 'ArrowUp':
              if (optionIndex > 0) {
                setOptionIndex(optionIndex - 1);
              }
              break;
            case 'ArrowDown':
              if (optionIndex < optionsLength - 1) {
                setOptionIndex(optionIndex + 1);
              }
              break;
          }
        }}
      >
        <span
          className={clsx(
            'h-10 p-2 bg-gray-300 dark:bg-gray-700 rounded-t-md flex justify-between items-center',
            !openList && 'rounded-b-md'
          )}
          onClick={() => setOpenList(!openList)}
        >
          <span className='text-lg md:text-xl font-medium'>{value}</span>
          <span
            className={clsx(
              'w-7 h-7 flex justify-items-end',
              openList && 'transform rotate-180'
            )}
          >
            <DropDownIcon className='w-7 h-7 fill-current text-gray-900 dark:text-gray-50' />
          </span>
        </span>
        {openList && (
          <div className='bg-gray-300 dark:bg-gray-700'>
            {props.button && (
              <div>
                <hr className='mb-1 mx-2 bg-gray-300 dark:bg-gray-700' />
                <div
                  className='font-medium bg-gray-400 dark:bg-gray-600 p-2 mx-1 rounded-md border-2 border-gray-300 dark:border-gray-700 hover:ring-2 ring-sky-600 flex justify-center items-center'
                  onClick={() => {
                    props.button?.();
                    setOpenList(false);
                  }}
                >
                  Create new folder
                </div>
                <hr className='my-1 mx-2 bg-gray-300 dark:bg-gray-700' />
              </div>
            )}
            <ul className='w-full h-full max-h-72 text-lg rounded-b-md overflow-auto'>
              {options}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

//TO IMPLEMENT: use uuid instead of label as the selected value
//This component will format each value in the list for the select box
function Options(props: {
  id: string;
  value: string;
  selectedValue: (v: string) => void;
}) {
  const id = props.id;
  const value = props.value;
  const selectedValue = props.selectedValue;

  return (
    <li
      value={id}
      className='w-full p-2 focus:bg-gray-400 hover:bg-gray-400'
      onClick={() => {
        selectedValue(value);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Esc') {
          selectedValue(value);
        }
      }}
    >
      {value}
    </li>
  );
}
