import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//App core components
import ToDo from './to-do';
import Notebook from './notebook';
//App theme context
import { ThemeProvider } from './components/theme-context';

function App() {
  //this state control the feature on screen todo or notebook
  let [openTodo, setOpenTodo] = useState(true);

  //this state will control the type of button to change will be used
  let [sm, setSm] = useState(false);

  //this state will control the type of button to change will be used
  let [md, setMd] = useState(false);

  //the following functionlatiy is to control the position and shape of the buttons
  //to change from one feature to another
  function getScreenWidth() {
    return window.innerWidth;
  }

  //this callback will be pased to the features component to control what the user want to do
  let changeFeat = useCallback(() => {
    setOpenTodo(!openTodo);
  }, [openTodo]);

  //this function will get the intial screen width
  useEffect(() => {
    getScreenWidth() > 639 ? setSm(true) : setSm(false);
    getScreenWidth() > 767 ? setMd(true) : setMd(false);
  }, []);

  //this function will be trigger in any screen resize to control the layout of the app, based on the VW
  useEffect(() => {
    function handleResize() {
      getScreenWidth() > 639 ? setSm(true) : setSm(false);
      getScreenWidth() > 767 ? setMd(true) : setMd(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider>
      <div className='max-w-5xl m-auto top'>
        {openTodo && (
          <ToDo
            changeToNotebook={changeFeat}
            showButtonText={sm}
            multiColumnLayout={md}
          />
        )}
        {!openTodo && (
          <Notebook
            changeToToDo={changeFeat}
            showButtonText={sm}
            multiColumnLayout={md}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
