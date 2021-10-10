//Just for the record, I know this code is very messy, probably very bad, I swear I will
//make a complete re-write of the text editor, so please be patient with me and don't judge me  based on this

//Once I launch the pre-alpha, which is basically just a demo versión on the UI, I will start the process
//of improving  this code, hopefully I can make it more performant and readable

//Also I will created a forced format to make it compatible with the thumbnails of the notes

import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  createEditor,
  BaseEditor,
  Descendant,
  Transforms,
  Editor,
  Element as SlateElement,
  Range,
  Point,
} from 'slate';
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  useSlate,
  useSlateStatic,
} from 'slate-react';
import isUrl from 'is-url';
import imageExtensions from 'image-extensions';

import icons from './icons';

type CustomElement = { type: string; children: CustomText[] };

type CustomText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
  code?: true;
};

type ImageElement = {
  type: 'image';
  url: string;
  children: EmptyText[];
};

type EmptyText = {
  text: string;
};

type CheckListElement = {
  type: 'check-item';
  checked: boolean;
  children: Descendant[];
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement | ImageElement | CheckListElement;
    Text: CustomText | EmptyText;
  }
}

export default function TextEditor(props: any) {
  const editor = useMemo(
    () => withCheckLists(withImage(withReact(createEditor()))),
    []
  );
  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ];
  const [value, setValue] = useState<Descendant[]>(initialValue);

  const renderElement = useCallback((props) => {
    return <Element {...props} />;
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className=''>
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <div className='w-full sticky py-2 top-0 left-0 z-10 bg-gray-50 dark:bg-gray-900'>
          <div className='flex flex-row overflow-x-scroll overflow-y-hidden sm:overflow-x-auto'>
            <MarkElementButton format={'bold'} icon={'bold'} />
            <MarkElementButton format={'italic'} icon={'italic'} />
            <MarkElementButton format={'underline'} icon={'underlined'} />
            <MarkElementButton format={'code'} icon={'code'} />

            <BlockElementButton format={'heading-one'} icon={'h1'} />
            <BlockElementButton format={'heading-two'} icon={'h2'} />
            <BlockElementButton format={'ordered-list'} icon={'ol'} />
            <BlockElementButton format={'unordered-list'} icon={'ul'} />
            <BlockElementButton format={'check-list'} icon={'check'} />
            <BlockElementButton format={'block-quote'} icon={'quote'} />

            <ImageElementButton />
          </div>
          <hr className='mt-1' />
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          autoFocus
          className='p-2 overflow-x-hidden'
        ></Editable>
      </Slate>
    </div>
  );
}

function Element(props: any) {
  const { element, children, attributes } = props;

  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'unordered-list':
      return (
        <ul className='styled-ul' {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'ordered-list':
      return (
        <ol className='styled-ol' {...attributes}>
          {children}
        </ol>
      );
    case 'image':
      return <Image {...props} />;
    case 'check-item':
      return <CheckItem {...props} />;
    case 'check-list':
      return <div {...attributes}>{children}</div>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

function Leaf({ leaf, children, attributes }: any) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  return <span {...attributes}>{children}</span>;
}

function isMarkActive(editor: Editor, format: any) {
  const marks: any = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

function toggleMark(editor: Editor, format: any) {
  const isActive = isMarkActive(editor, format);

  isActive
    ? Editor.removeMark(editor, format)
    : Editor.addMark(editor, format, true);
}

function isBlockActive(editor: Editor, format: any) {
  const [match]: any = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
}

const LIST_TYPES = ['ordered-list', 'unordered-list'];
const bobo = ['check-list'];

function toggleBlock(editor: Editor, format: any) {
  let isActive = isBlockActive(editor, format);
  let isList = LIST_TYPES.includes(format);
  let isCheckList = bobo.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        (!Editor.isEditor(n) && SlateElement.isElement(n) && n.type) || ''
      ),
    split: true,
  });

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      bobo.includes(
        (!Editor.isEditor(n) && SlateElement.isElement(n) && n.type) || ''
      ),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive
      ? 'paragraph'
      : isCheckList
      ? 'check-item'
      : isList
      ? 'list-item'
      : format,
  };

  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }

  if (!isActive && isCheckList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

function MarkElementButton({
  format,
  icon,
}: PropsWithChildren<{
  format: string;
  icon: string;
}>) {
  const editor = useSlate();
  const iconSvg = icons(icon, isMarkActive(editor, format));

  return (
    <button
      className='btn-icon'
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {iconSvg}
    </button>
  );
}

function BlockElementButton({
  format,
  icon,
}: PropsWithChildren<{
  format: string;
  icon: string;
}>) {
  const editor = useSlate();
  const iconSvg = icons(icon, isBlockActive(editor, format));

  return (
    <button
      className='btn-icon'
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {iconSvg}
    </button>
  );
}

function Image({ element, children, attributes }: any) {
  // const seleted = useSelected();
  // const focused = useFocused();

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img src={element.url} alt='' />
      </div>
      {children}
    </div>
  );
}

function withImage(editor: Editor) {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}

function insertImage(editor: Editor, url: any) {
  const text = { text: '' };
  const image: ImageElement = { type: 'image', url, children: [text] };
  Transforms.insertNodes(editor, image);
}

function isImageUrl(url: any) {
  if (!url) return false;
  if (!isUrl(url)) return false;

  const ext = new URL(url).pathname.split('.').pop() || '';
  return imageExtensions.includes(ext);
}

function ImageElementButton() {
  const editor = useSlateStatic();
  const iconSvg = icons('image', false);

  return (
    <button
      className='btn-icon'
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt('Enter image URL:');
        if (url && !isImageUrl(url)) {
          alert('URL is not an image');
          return;
        }
        insertImage(editor, url);
      }}
    >
      {iconSvg}
    </button>
  );
}

function withCheckLists(editor: Editor) {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === 'check-item',
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          };

          Transforms.setNodes(editor, newProperties, {
            match: (n) =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'check-item',
          });

          return;
        }
      }
    }

    deleteBackward(...args);
  };

  return editor;
}

function CheckItem({ element, children, attributes }: any) {
  const editor = useSlate();
  const { checked } = element;

  return (
    <label className='block' {...attributes}>
      <input
        type='checkbox'
        className='form-checkbox'
        checked={checked}
        onChange={(event) => {
          const path = ReactEditor.findPath(editor, element);
          const newProperties: Partial<SlateElement> = {
            checked: event.target.checked,
          };
          Transforms.setNodes(editor, newProperties, { at: path });
        }}
      />
      {children}
    </label>
  );
}
