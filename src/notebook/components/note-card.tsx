interface INoteCard {
  title: string;
  description: string;
  //TO IMPLEMENT: this callback will show the note content when clicked
  editor: () => void;
}

//componet to use as a template for the notes cards
export default function NoteCard(props: INoteCard) {
  return (
    <div tabIndex={0} onClick={() => props.editor()}>
      <div
        tabIndex={0}
        className='bg-gray-300 dark:bg-gray-700 p-2 border-2 border-gray-50 dark:border-gray-900 rounded-md my-1 outline-none focus:ring-2 hover:ring-2 ring-sky-600'
      >
        <div className='text-lg font-medium'>{props.title}</div>
        <div>{props.description}</div>
      </div>
    </div>
  );
}
