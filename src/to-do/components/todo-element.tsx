import { useEffect, useRef, useState } from 'react';
//this function returns the respective svg icon
import { icons } from '../../components/icons';

//This component has the related functionality to control a single element in a todo list, and
//renders the style of the 'to-do'
export default function ToDoElement(props: any) {
  //this state hold the task text, so this is the one that change if the user wants to edit
  let [change, setChange] = useState<string>(props.value);
  //open the to do menu (edit, delete)
  let [showMenu, setShowMenu] = useState(false);
  //open the form to edit a task
  let [openEdit, setOpenEdit] = useState(false);
  //this is the value of the edit form input box, this is like this because I prefer to only make the change
  //once the user submit the changes instead of do it live
  let [inputValue, setInputValue] = useState(props.value);
  //this is the reference of the edit form input box
  let inputEdit: React.RefObject<HTMLInputElement> = useRef(null);
  //thus is the reference of the todoMenu, modal VW < 768 and dropdown VW > 767
  let todoMenu: React.RefObject<HTMLDivElement> = useRef(null);

  //function will be triggered to the document.eventListener
  function handleOutsideClick(e: any) {
    if (todoMenu?.current && !todoMenu.current.contains(e.target)) {
      setShowMenu(false);
    }
  }

  //this effect is to bind the eventListener to close the todoElement when the user clicks outside the menu
  useEffect(() => {
    if (!showMenu) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
  }, [showMenu]);

  //once the chnage state changes it submit the change calling the 'editElement' callback
  useEffect(() => {
    props.editElement(props.id, change);
  }, [change, props]);

  //this function will check if the change is valid and different from the current value, then modify the
  //'change' state
  function handleEdit(v: any, elem: any) {
    //a reference to a input box
    let val = v.current.value;

    //condition to check value validity, if one of this condition is true it will send an alert, and close
    //the edit form or the confirmation modal
    if (val === '') {
      alert(
        "Insert your changes inside the input box.\nIf you want to delete the task instead, press the 'delete' button."
      );
      setOpenEdit(false);
    } else if (val === elem) {
      alert(
        "You didn't make any changes.\nIf you want to change the task description press the 'edit' button, then write the new description inside the input box."
      );
      setOpenEdit(false);
    }

    //if everyting it's ok make the changes and close the respective menus
    setChange(val);
    setOpenEdit(false);
  }

  //since the input box value is a controlled field we need to change the value (inputValue state)
  //while the user is writing
  function handleChange(e: any) {
    setInputValue(e.target.value);
  }

  //TO IMPLEMENT: this function will handle the edit form submit
  //function handleEditSubmit() {}

  //TO IMPLEMENT: this function will call the deleteElement callback to delete a to do, and will prompt a little
  //message to the users where they can undo the delete
  //function handleDelete() {}

  return (
    <div key={props.id} className='flex justify-between items-center relative'>
      {!openEdit && (
        <div className='py-2'>
          <label className='w-full flex flex-initial'>
            <input type='checkbox' className='form-checkbox flex-none mt-1' />
            <span className='flex-initial'>{props.value}</span>
          </label>
        </div>
      )}
      {openEdit && (
        <form onSubmit={(e) => e.preventDefault()} className='w-full'>
          <input
            type='text'
            className='block w-full'
            value={inputValue}
            ref={inputEdit}
            disabled={!openEdit}
            onChange={handleChange}
          />
          <span className='mt-1 grid grid-cols-2 gap-1'>
            <button
              className='btn-main w-full bg-red-600 ring-red-600'
              disabled={!openEdit}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn-main w-full bg-sky-600 ring-sky-600'
              onClick={() => handleEdit(inputEdit, props.value)}
              disabled={!openEdit}
            >
              Save changes
            </button>
          </span>
        </form>
      )}
      {!openEdit && (
        <div
          ref={todoMenu}
          tabIndex={0}
          className='w-7 h-7 relative top-0 right-0 rounded-full focus:bg-gray-200 dark:focus:bg-gray-800 cursor-pointer flex justify-center items-center'
          onClick={() => setShowMenu(!showMenu)}
        >
          {icons('more', 'z-auto md:z-20')}
          {showMenu && (
            <div className='md:bg-opacity-0 md:dark:bg-opacity-0 bg-gray-900 dark:bg-gray-50 bg-opacity-30 dark:bg-opacity-30 w-full h-full p-2 md:p-0 fixed md:absolute top-0 md:top-1 left-0 z-10'>
              <div className=' w-72 m-auto block bg-gray-50 dark:bg-gray-800 p-2 rounded-md relative top-1/2 transform -translate-y-1/2 md:top-full md:left-7 md:transform md:-translate-x-full shadow'>
                <button
                  className='btn-main w-full bg-sky-600 ring-sky-600'
                  onClick={() => {
                    setShowMenu(false);
                    setOpenEdit(true);
                  }}
                >
                  Edit task
                </button>
                <button
                  className='btn-main block mt-2 w-full bg-red-600 ring-red-600'
                  onClick={() => props.deleteElement(props.id)}
                >
                  Delete task
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
