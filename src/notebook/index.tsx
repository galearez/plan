import { useCallback, useEffect, useState } from 'react';
//this components have functionality realted to the 'notebook' feature UI
import TextEditor from './components/editor';
import CustomSelect from '../components/select';
import SideMenu from '../components/side-menu';
import NoteCard from './components/note-card';
//this function return the respective svg icon
import { icons } from '../components/icons';

//que los titulos sean 20 char max para los cuadernos
interface INotebookProps {
  changeToToDo: () => void;
  showButtonText: boolean;
  multiColumnLayout: boolean;
}

//this is the type for the Notebooks
interface INotebooks {
  id: number;
  label: string;
  notes: INotes[];
}

//this is the type for the Notes
interface INotes {
  id: number;
  title: string;
  content: string; //this will change
}

//TEMP: this will be the format to store the notebooks and their notes
const libretas = [
  {
    id: 1234,
    label: 'First notebook',
    notes: [
      { id: 51321, title: 'Title shorter than 30 chars', content: '' },
      { id: 54321, title: 'Title shorter than 30 chars', content: '' },
    ],
  },
  {
    id: 1235,
    label: 'Second notebook',
    notes: [
      { id: 54421, title: 'Title shorter than 30 chars', content: '' },
      { id: 53321, title: 'Title shorter than 30 chars', content: '' },
      { id: 56321, title: 'Title shorter than 30 chars', content: '' },
    ],
  },
  {
    id: 1236,
    label: 'Meetings',
    notes: [{ id: 14321, title: 'Title shorter than 30 chars', content: '' }],
  },
  {
    id: 1237,
    label: 'Class',
    notes: [
      { id: 59321, title: 'Title shorter than 30 chars', content: '' },
      { id: 54311, title: 'Title shorter than 30 chars', content: '' },
    ],
  },
];
//This component will handle everything related to the notebook feature, notebooks (folders), notes,
//quickview (mobile only) and the text editor
export default function Notebook(props: INotebookProps) {
  let [notebooks, setNotebooks] = useState<INotebooks[]>(libretas);
  let [currentNotebook, setCurrentNotebook] = useState<any>(
    notebooks[0]?.label
  );

  //this states are meant to control if an element will be rendered or not
  let [openMenu, setOpenMenu] = useState(false);
  let [openNotes, setOpenNotes] = useState(true);

  //this will be replace and instead of hold a boolean value, it will hold the data to pass to the editor,
  //when the user is outside the editor or they haven't selected a note to see, the value will be empty
  //that way we can still use conditional rendering
  let [openEditor, setOpenEditor] = useState(false);

  //this is the element to create the cards inside a notebook
  let [notes, setNotes] = useState<INotes[]>(notebooks[0]?.notes);

  //this state will control which element was on focus before shrinking the screen to mobile size
  let [focusedElement, setFocusedElement] = useState('notes');

  //function to control the side menu (settings)
  let closeMenu = useCallback((v: boolean) => {
    setOpenMenu(v);
  }, []);

  //most elements will be controlled by conditional rendering, there is one state
  //for each one of the main elements, this function change their state depending on the multiColumnLayout prop
  //which is passed by the App component
  useEffect(() => {
    if (props.multiColumnLayout) {
      setOpenEditor(true);
      setOpenNotes(true);
      return;
    }

    //when the user shrink their screen we want the app to be in the same screen they were using, so this
    //conditional will keep open the one the user had focus on
    switch (focusedElement) {
      //if notes was focused close editor
      case 'notes':
        setOpenEditor(false);
        break;
      //if editor was focused close notes
      case 'editor':
        setOpenNotes(false);
        break;
      default:
        return;
    }
  }, [props, focusedElement]);

  //this function creates a new notebook (folder), it's passed to the CustomSelect so the user can create a new
  //notebook from there
  let createNotebook = useCallback(() => {
    setNotebooks((prevElem) => {
      return [...prevElem, { id: 12324, label: 'cuatro', notes: [] }];
    });
  }, []);

  let editorContent = useCallback(() => {
    if (!props.multiColumnLayout) {
      setOpenEditor(true);
      setOpenNotes(false);
    }
    return;
  }, [props]);

  function createNewNote() {
    setNotes((prevElements) => {
      return [
        ...prevElements,
        {
          id: 1234,
          title: 'Title shorter than 30 chars',
          description:
            'DEscriptions smaller than 105 char. Tarf ishm obst ertornad obl esscha rism aticd reamb unny akmslamc mmasawqws',
          content: '',
        },
      ];
    });
  }

  //TO IMPLEMENT: this callback will take a number, since it's better to use the uuid
  //this callback will be passed to the 'CustomSelect', this will change notebook the user want to see
  let getNotebookId = useCallback((v: any) => {
    setCurrentNotebook(v);
  }, []);

  //TO IMPLEMENT: use the uuid instead of the label
  //this function set the notes to render to the notes of the notebook the user wants to see
  useEffect(() => {
    const changeNotes = notebooks.filter(
      (notebook) => notebook.label === currentNotebook
    );

    setNotes(changeNotes[0].notes);
  }, [currentNotebook, notebooks]);

  //this cards are the notes 'thumbnails'
  let notesList = notes.map((elem: any) => (
    <NoteCard
      key={elem.id}
      title={elem.title}
      description={elem.description}
      editor={editorContent}
    />
  ));

  return (
    <div className='relative md:grid grid-cols-12'>
      <div className='col-span-12'>
        <div className='w-full h-10 mb-2 flex justify-between items-center'>
          {/* This is to select a notebook */}
          {openNotes && (
            <CustomSelect
              elements={notebooks}
              button={createNotebook}
              selected={getNotebookId}
            />
          )}
          {/* Back button */}
          {openEditor && !openNotes && (
            <div
              className='w-full h-10 flex justify-between items-center text-xl font-semibold'
              onClick={() => {
                if (openEditor) {
                  setOpenEditor(false);
                  setOpenNotes(true);
                }

                return;
              }}
            >
              {icons('back')}
            </div>
          )}
          {/* Open the settings menu */}
          <div className='flex items-center gap-3'>
            <button
              tabIndex={0}
              className='w-14 h-14 sm:w-auto sm:h-10 sm:p-2 sm:text-lg text-gray-50 font-medium bg-sky-600 rounded-full sm:rounded-md flex justify-center items-center fixed right-3 bottom-3 sm:relative sm:right-auto sm:bottom-auto'
              onClick={() => props.changeToToDo()}
            >
              {icons('todo', 'w-7 h-7 sm:w-5 sm:h-5 sm:mr-3')}
              {props.showButtonText && 'To do'}
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

      {/* Note list screen */}
      {openNotes && (
        <div
          className='mt-1 col-start-1 md:col-span-5 lg:col-span-4 md:pr-2'
          onClick={() => {
            if (props.multiColumnLayout) {
              setFocusedElement('notes');
            }
          }}
        >
          <button
            className='btn-secondary w-full'
            onClick={() => createNewNote()}
          >
            Create new note
          </button>
          {/* This card is just a template, once storage features are added this cards will be autogenerated
          using the info for the origin file */}
          {notesList}
        </div>
      )}
      {/* Rich text editor, here the notes content will be edited, it will take another property, wich
      will be the note content, that feature it's not ready yet */}
      {openEditor && (
        <div
          className='row-start-2 row-span-3 md:col-start-6 md:col-span-7 lg:col-start-5 lg:col-span-8'
          onClick={() => {
            if (props.multiColumnLayout) {
              setFocusedElement('editor');
            }
          }}
        >
          <TextEditor nav={!openNotes} />
        </div>
      )}
      {/* Setting menu */}
      <SideMenu open={openMenu} closeMenu={closeMenu} />
    </div>
  );
}
