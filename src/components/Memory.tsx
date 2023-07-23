import { useEffect, useMemo, useState } from 'react';

import { Card } from "./Card";
import { Restart } from './Restart';

import "./Memory.css";

enum AppState {
    PICK_ONE = 0,
    PICK_TWO = 1,
    DISABLED = 2,
}

export interface MemoryAudioUri {
    goodUri: string;
    badUri: string;
}

export interface MemoryProps {
    audioUris: MemoryAudioUri[];
    imageUris: string[];
}

function getFrequencyMap(array: any[]) {
    const frequencyMap = new Map<any, number>();

    for (const value of array) {
        if (!frequencyMap.has(value))
            frequencyMap.set(value, 0);
        frequencyMap.set(value, frequencyMap.get(value)! + 1);
    }

    return frequencyMap;
}

function generateRandomGridValues(n: number) {
    const addedVals = new Set<number>();
    for (let i = 0; addedVals.size < 6; i++) {
        const val = Math.floor(Math.random() * n);
        addedVals.add(val);
    }
    const randVals = Array.from(addedVals);
    for (let i = 0; i < 6; i++) {
        randVals.push(randVals[i]);
    }
    // shuffle
    for (let i = randVals.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randVals[i], randVals[j]] = [randVals[j], randVals[i]];
    }
    return randVals;
}


export function Memory(props: MemoryProps) {
    const [flipped, setIsFlipped] = useState<boolean[]>(new Array(12).fill(false));
    const [appState, setAppState] = useState<AppState>(AppState.PICK_ONE);
    const [lastSelectedIdx, setLastSelectedIdx] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [reshuffle, setReshuffle] = useState(false);

    const audios = useMemo(() => props.audioUris.map(uris => [new Audio(uris.goodUri), new Audio(uris.badUri)]), [props.audioUris]);
    // eslint-disable-next-line
    const vals = useMemo(() => generateRandomGridValues(props.imageUris.length), [props.imageUris, reshuffle]);

    useEffect(() => {
        if (flipped.every(f => f)) {
            setIsFinished(true);
            return;
        }
    }, [flipped]);

    const onClick = (i: number) => {
        if (flipped[i] || isFinished) return;
        if (appState !== AppState.DISABLED) {
            setIsFlipped([...flipped.slice(0, i), true, ...flipped.slice(i + 1)]);
            const nextState = appState + 1;
            setAppState(nextState);
            setLastSelectedIdx(i);

            // handle Audio
            for (let i = 0; i < audios.length; i++) {
                for (const a of audios[i]) {
                    const isPlaying = (
                        a.currentTime > 0 && !a.paused && !a.ended
                        && a.readyState > a.HAVE_CURRENT_DATA
                    );
                    if (isPlaying) {
                        a.pause();
                        a.currentTime = 0;
                    }
                }
            }
            if (appState === AppState.PICK_ONE) {
                const [, bad] = audios[vals[i]];
                bad.play();
            }
            else if (lastSelectedIdx && appState === AppState.PICK_TWO) {
                const [good, bad] = audios[vals[i]];
                if (vals[lastSelectedIdx] === vals[i] && i !== lastSelectedIdx) {
                    good.play();
                } else {
                    bad.play();
                }
            }


            if (nextState === AppState.DISABLED) {
                // reset flipped
                setTimeout(() => {
                    setAppState(AppState.PICK_ONE);
                    const frequency = getFrequencyMap(vals.filter((_, j) => i === j || flipped[j]));
                    setIsFlipped(vals.map(val => frequency.get(val) === 2));
                    setLastSelectedIdx(null);
                }, 1500);
            }
        }
    };

    const restartMemoryGame = () => {
        setIsFlipped(new Array(12).fill(false));
        setAppState(AppState.PICK_ONE);
        setLastSelectedIdx(null);
        setIsFinished(false);
        setReshuffle(!reshuffle);
    };

    return (
        <div>
            <div className="memory-grid-container">
                {flipped.map((f, i) => (
                    <div className='memory-grid-item' key={i}>
                        <Card
                            isFlipped={f}
                            value={vals[i]}
                            imageUri={props.imageUris[vals[i]]}
                            onClick={() => onClick(i)} />
                    </div>
                ))}
                {isFinished && <Restart onClick={restartMemoryGame} speak={true} />}
            </div>
        </div>
    );
}