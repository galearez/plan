import React, { useCallback, useRef, useState } from 'react';
//this package helps with class names
import clsx from 'clsx';
//this function generates random uuids
import { v4 as uuidv4 } from 'uuid';
//this component has related functionality
import ToDoElement from './todo-element';
//this function return the respective svg icon
import { icons } from '../../components/icons';

interface ITaskList {
  //TO IMPLEMENT: this will be an array of todoElement
  tasks: any;
  //TO IMPLEMENT: this will receive the title of the list
  title: string;
  //TO IMPLEMENT: this callback will show the list content (to do elements) when clicked
  listContent?: () => void;
}

//this component render a single task list, each list can contain none or multiple 'to-dos', and since
//each 'to-do' has functionality it calls the 'ToDoElement' component to reander each element in the list
export default function TaskList(props: ITaskList) {
  //elements in the selected day
  let [elements, setElements] = useState<any[]>(props.tasks);
  //control the form to add a new task
  let [inputOpen, setInputOpen] = useState(false);
  //reference to the input box in the add task form
  let todo = useRef(null);

  //handle form submit
  function handleFormSubmit(e: any, value: any) {
    e.preventDefault();
    createElement(value);
  }

  //this function is called when the user wants to add a new task
  function createElement(v: any) {
    //user current text
    let todo = v.current.value;

    //only task with valid string values will be submitted as a new task
    if (todo === '') {
      alert(
        "You didn't insert any task.\nIf you want to create a new task, press 'Add new task' and write something in the text field, then press 'Add task'."
      );
      setInputOpen(false);
      return;
    }

    //once we make sure there are valid string we create the task
    setElements((prevElems) => {
      return [
        ...prevElems,
        { id: uuidv4(), description: todo, complete: false },
      ];
    });

    //clean the input box for the next tasks
    v.current.value = null;
    setInputOpen(false);
  }

  //this function delete a single element in the task list, this function is a callback because each task
  //has its own menu to control it, so we need to pass it to the lower level component
  let deleteElement = useCallback(
    (id: number) => {
      //what we are doing here is to return a new array containing only the values which id is different to the
      //one passed as parameter
      let resultElementList = elements.filter((elem) => elem.id !== id);
      setElements(resultElementList);
    },
    [elements]
  );

  //this function edit a value in the task list, this function is a callback because each task
  //has its own menu to control it, so we need to pass it to the lower level component, this function
  //require a validity check so it is implement in the lower level component
  let editElement = useCallback(
    (id: number, change: string) => {
      //look for a value passed as id, if it find a match it will make the change, if not only return
      //the elem without any change
      let resultElementList = elements.map((elem) => {
        if (elem.id === id) {
          return { id: elem.id, description: change, complete: elem.complete };
        }

        return elem;
      });
      setElements(resultElementList);
    },
    [elements]
  );

  //create a list to render the day tasks
  let todoList = elements.map((elem) => (
    <ToDoElement
      id={elem.id}
      key={elem.id}
      value={elem.description}
      deleteElement={deleteElement}
      editElement={editElement}
    />
  ));

  return (
    <div className='mb-1' onClick={() => props.listContent?.()}>
      <div className='flex gap-3 justify-between font-medium text-lg mb-1 sm:text-xl items-center'>
        {props.title}
        <button
          className='pl-1 py-1 flex gap-1 font-medium text-base bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-50 border-2 border-gray-50 dark:border-gray-900 rounded-md outline-none focus:ring-2 hover:ring-2 ring-sky-600'
          onClick={() => setInputOpen(true)}
        >
          New task
          {icons('add')}
        </button>
      </div>
      {todoList}
      <form
        onSubmit={(e) => handleFormSubmit(e, todo)}
        className={clsx(inputOpen ? 'block' : 'hidden')}
      >
        <input type='text' ref={todo} className='w-full' autoFocus={true} />
        <span className='grid grid-cols-2 gap-1'>
          <button
            className='btn-main my-1 bg-red-600 ring-red-600'
            onClick={() => setInputOpen(false)}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='btn-main my-1 bg-sky-600 ring-sky-600'
          >
            Add task
          </button>
        </span>
      </form>
    </div>
  );
}
