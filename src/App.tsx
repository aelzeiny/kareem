import './App.css';
import { Find } from './components/Find';
import { Memory } from './components/Memory';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const COLORS = ['red', 'yellow', 'orange', 'blue', 'green', 'purple'];
const FAMILY = ['amo', 'baba', 'deedee', 'giddo', 'leena', 'mama', 'nana', 'susu', 'tita'];

const getBadUri = (path: string, n: string) => `/assets/${path}/audio/${n}.mp3`;
const getGoodUri = (path: string, n: string) => `/assets/${path}/audio/${n}!.mp3`;
const getQuestionUri = (path: string, n: string) => `/assets/${path}/audio/fin ${n}.mp3`;
const getAudioUris = (arr: string[], path: string) => arr.map(n => ({ goodUri: getGoodUri(path, n), badUri: getBadUri(path, n) }));
const getImageUris = (arr: string[], path: string) => arr.map(n => `/assets/${path}/images/${n}.png`);


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h2>Memory</h2>
        <ul>
          <li><a href='/memory/numbers'>Numbers</a></li>
          <li><a href='/memory/colors'>Colors</a></li>
          <li><a href='/memory/family'>Family</a></li>
        </ul>
        <br />
        <h2>Find</h2>
        <ul>
          <li><a href='/find/numbers'>Numbers</a></li>
          <li><a href='/find/colors'>Colors</a></li>
          <li><a href='/find/family'>Family</a></li>
        </ul>
      </div>
    )
  },
  {
    path: "/kareem",
    element: <h1>KAREEM</h1>
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
