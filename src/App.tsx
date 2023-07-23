import './App.css';
import { Find } from './components/Find';
import { Memory } from './components/Memory';

import {
  createHashRouter,
  Link,
  RouterProvider,
} from "react-router-dom";

const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const COLORS = ['red', 'yellow', 'orange', 'blue', 'green', 'purple'];
const FAMILY = ['amo', 'baba', 'deedee', 'giddo', 'leena', 'mama', 'nana', 'susu', 'tita'];

const getBadUri = (path: string, n: string) => `${window.location.pathname}assets/${path}/audio/${n}.mp3`;
const getGoodUri = (path: string, n: string) => `${window.location.pathname}assets/${path}/audio/${n}!.mp3`;
const getQuestionUri = (path: string, n: string) => `${window.location.pathname}assets/${path}/audio/fin ${n}.mp3`;
const getImageUris = (arr: string[], path: string) => arr.map(n => `${window.location.pathname}assets/${path}/images/${n}.png`);
const getAudioUris = (arr: string[], path: string) => arr.map(n => ({ goodUri: getGoodUri(path, n), badUri: getBadUri(path, n) }));

function TableOfContents(prefix: string) {
  return (
    <div>
      <h2>Memory</h2>
      <ul>
        <li><Link to={`${prefix}/memory/numbers`}>Numbers</Link></li>
        <li><Link to={`${prefix}/memory/colors`}>Colors</Link></li>
        <li><Link to={`${prefix}/memory/family`}>Family</Link></li>
      </ul>
      <br />
      <h2>Find</h2>
      <ul>
        <li><Link to={`${prefix}/find/numbers`}>Numbers</Link></li>
        <li><Link to={`${prefix}/find/colors`}>Colors</Link></li>
        <li><Link to={`${prefix}/find/family`}>Family</Link></li>
      </ul>
    </div>
  );
}

const router = createHashRouter([
  {
    path: "/",
    element: TableOfContents(''),
  },
  {
    path: "/kareem",
    element: TableOfContents('/kareem')
  },
  {
    path: "/memory/numbers",
    element: <Memory audioUris={getAudioUris(NUMS, 'numbers')} imageUris={getImageUris(NUMS, 'numbers')} />
  },
  {
    path: "/memory/colors",
    element: <Memory audioUris={getAudioUris(COLORS, 'colors')} imageUris={getImageUris(COLORS, 'colors')} />,
  },
  {
    path: "/memory/family",
    element: <Memory audioUris={getAudioUris(FAMILY, 'family')} imageUris={getImageUris(FAMILY, 'family')} />,
  },
  {
    path: "/find/numbers",
    element: (
      <Find
        imageUris={getImageUris(NUMS, 'numbers')}
        questionUris={NUMS.map(n => getQuestionUri('numbers', n))}
        goodUris={NUMS.map(n => getGoodUri('numbers', n))} />
    ),
  },
  {
    path: "/find/colors",
    element: (
      <Find
        imageUris={getImageUris(COLORS, 'colors')}
        questionUris={COLORS.map(n => getQuestionUri('colors', n))}
        goodUris={COLORS.map(n => getGoodUri('colors', n))} />
    ),
  },
  {
    path: "/find/family",
    element: (
      <Find
        imageUris={getImageUris(FAMILY, 'family')}
        questionUris={FAMILY.map(n => getQuestionUri('family', n))}
        goodUris={FAMILY.map(n => getGoodUri('family', n))} />
    ),
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
