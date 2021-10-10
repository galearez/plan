import { useCallback, useEffect, useState } from 'react';
//this components have functionality realted to the 'to-do' feature UI
import CustomSelect from '../components/select';
import SideMenu from '../components/side-menu';
import TaskList from './components/task-lists';
//this function return the respective svg icon
import { icons } from '../components/icons';

//ToDo props type
interface ITodoProps {
  changeToNotebook: () => void;
  showButtonText: boolean;
  multiColumnLayout: boolean;
}

//task group list type
interface ITaskGroup {
  id: number;
  label: string;
  lists: IToDoList[];
}

//todo list type
interface IToDoList {
  id: number;
  list: string;
  todos: string;
}

//TO IMPLEMENT: this will be the future 'to do Element' interface, since we need a more complete way to
//store the tasks
// interface ITodo {
//   id: number;
//   day?: Date; // to organize the to-dos by day, this will only apply  to the list 'Next 7 days'
//   content: string;
//   checked: boolean;
// }

//TEMP: this will be the format to store the folders and their to-dos
const taskGroups = [
  {
    id: 1234,
    label: 'Personal',
    lists: [
      { id: 54421, list: 'Next 7 days', todos: '' },
      { id: 54221, list: 'Groceries list', todos: '' },
    ],
  },
  {
    id: 1235,
    label: 'Work',
    lists: [
      { id: 52321, list: 'Next 7 days', todos: '' },
      { id: 57321, list: 'Meeting', todos: '' },
      { id: 51321, list: 'Something else', todos: '' },
    ],
  },
  {
    id: 1236,
    label: 'Plan app',
    lists: [{ id: 44321, list: 'Next 7 days', todos: '' }],
  },
];

//This component will control everything in the todo list feature
export default function ToDo(props: ITodoProps) {
  //todo lists
  let [groups, setGroups] = useState<ITaskGroup[]>(taskGroups);

  //selected task list
  let [currentGroup, setCurrentGroup] = useState(groups[0]?.label);

  //this states will control what is on the users view when they interact with the app
  let [openList, setOpenLists] = useState(true);
  let [openTodos, setOpenTodos] = useState(true);

  //control the side menu (settings)
  let [openMenu, setOpenMenu] = useState(false);

  //this state is to render the todo lists inside a group
  let [lists, setLists] = useState<IToDoList[]>(groups[0].lists);

  //clos the side menu this callback is passed through the SideMenu component
  let closeMenu = useCallback((v: boolean) => {
    setOpenMenu(v);
  }, []);

  //TO IMPLEMENT: this callback will take a number, since it's better to use the uuid
  //callback to get the user selection from the CustomSelect component
  let getGroupId = useCallback((value: string) => {
    setCurrentGroup(value);
  }, []);

  //TO IMPLEMENT: use the uuid instead of the label
  //this effect will be trigger if the user select a different task group in the select box
  //once triggered will change the lists of todos to the ones in the selected group
  useEffect(() => {
    const changeLists = groups.filter((g) => g.label === currentGroup);

    setLists(changeLists[0].lists);
  }, [groups, currentGroup]);

  //add new todo list
  let createToDoList = useCallback(() => {
    setGroups((prevElem) => {
      return [...prevElem, { id: 12324, label: 'Four', lists: [] }];
    });
  }, []);

  //this state will control where the user clicked last to set that part as the focusedElement
  let [focusedElement, setFocusedElement] = useState('lists');

  //this effect will close the todos if the origin size of the screen is < 768
  useEffect(() => {
    if (!props.multiColumnLayout) {
      setOpenTodos(false);
    }
    return;
  }, [props]);

  //this effect will open both UI elements the list view and the todos when VW > 767
  useEffect(() => {
    if (props.multiColumnLayout) {
      setOpenLists(true);
      setOpenTodos(true);
      return;
    }

    switch (focusedElement) {
      case 'lists':
        setOpenTodos(false);
        break;
      case 'todos':
        setOpenLists(false);
        break;
      default:
        return;
    }
  }, [focusedElement, props]);

  //this function will change the focus to the todos if the user clicked in a list, is a temporary function
  function handleListClick() {
    if (!props.multiColumnLayout) {
      setOpenLists(false);
      setOpenTodos(true);
    }
  }

  //this function will change the focus to the lists if the user clicked the go back button
  function handleGoBack() {
    setOpenLists(true);
    setOpenTodos(false);
  }

  //this variable will hold the lists of to do
  //this variable will be replaced by a component just as src/notebook/modules/note-card
  const todoLists = lists.map((elem) => (
    <div
      key={elem.id}
      className='font-medium text-lg bg-gray-300 dark:bg-gray-700 p-2 border-2 border-gray-50 dark:border-gray-900 rounded-md mb-1 outline-none focus:ring-2 hover:ring-2 ring-sky-600'
      onClick={() => handleListClick()}
    >
      {elem.list}
    </div>
  ));

  return (
    <div className='relative grid grid-cols-1 md:grid-cols-12 gap-y-1 md:gap-x-2'>
      <div className='col-span-12'>
        <div className='w-full h-10 mb-2 flex justify-between items-center'>
          {openList && (
            <CustomSelect
              elements={groups}
              button={createToDoList}
              selected={getGroupId}
            />
          )}
          {!openList && openTodos && (
            <div onClick={() => handleGoBack()}> {icons('back')} </div>
          )}

          <div className='flex items-center gap-3'>
            <button
              tabIndex={0}
              className='w-14 h-14 sm:w-auto sm:h-10 sm:p-2 sm:text-lg text-gray-50 font-medium bg-sky-600 rounded-full sm:rounded-md flex justify-center items-center fixed right-3 bottom-3 sm:relative sm:right-auto sm:bottom-auto'
              onClick={() => props.changeToNotebook()}
            >
              {icons('notebook', 'w-9 h-9 sm:w-7 sm:h-7 ml-1 sm:mr-2')}
              {props.showButtonText && 'Notebook'}
            </button>
            <span
              className='w-8 h-8 flex justify-center items-center'
              onClick={() => setOpenMenu(true)}
            >
              {icons('menu', 'w-7 h-7')}
            </span>
          </div>
        </div>
        <hr />
      </div>
      {openList && (
        <div
          className='col-start-1 md:col-span-5 lg:col-span-4 md:pr-2'
          onClick={() => {
            if (props.multiColumnLayout) {
              setFocusedElement('lists');
            }
          }}
        >
          <button className='btn-secondary w-full mb-1' onClick={() => {}}>
            Create new note
          </button>
          {todoLists}
        </div>
      )}
      {openTodos && (
        <div
          className='md:col-start-6 md:col-span-7 lg:col-start-5 lg:col-span-8'
          onClick={() => {
            if (props.multiColumnLayout) {
              setFocusedElement('todos');
            }
          }}
        >
          <TaskList tasks={[]} title={'Today - Sunday'} />
          <TaskList tasks={[]} title={'Monday'} />
          <TaskList tasks={[]} title={'Tuesday'} />
          <TaskList tasks={[]} title={'Wednesday'} />
          <TaskList tasks={[]} title={'Thursday'} />
          <TaskList tasks={[]} title={'Friday'} />
          <TaskList tasks={[]} title={'Saturday'} />
        </div>
      )}
      <SideMenu open={openMenu} closeMenu={closeMenu} />
    </div>
  );
}
