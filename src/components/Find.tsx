import { useEffect, useMemo, useState } from "react";
import { Card } from "./Card";
import { Restart } from "./Restart";

import CardBack from "../card-back-wrong.png";
import "./Find.css";


export interface FindProps {
    questionUris: string[];
    goodUris: string[];
    imageUris: string[];
}

const YAY_URI = `${window.location.pathname}assets/yay!.mp3`;

export function Find(props: FindProps) {
    const [answerIdx, setAnswerIdx] = useState(Math.floor(Math.random() * 3));
    const [flipped, setFlipped] = useState(new Array(3).fill(true));
    const [shuffle, setShuffle] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [ready, setReady] = useState(false);

    const questionAudios = useMemo(() => props.questionUris.map(uri => new Audio(uri)), [props.questionUris]);
    const goodAudios = useMemo(() => props.goodUris.map(uri => new Audio(uri)), [props.goodUris]);
    const yay = useMemo(() => new Audio(YAY_URI), []);

    const playAudio = (audio: HTMLAudioElement) => {
        return new Promise((resolve) => {
            // pause all audios
            for (const a of questionAudios) {
                a.pause();
            }
            for (const a of goodAudios) {
                a.pause();
            }
            yay.pause();
            // play
            const listener = () => {
                audio.removeEventListener("ended", listener);
                resolve(null);
            };
            audio.addEventListener("ended", listener);

            const isPlaying = (
                audio.currentTime > 0 && !audio.paused && !audio.ended
                && audio.readyState > audio.HAVE_CURRENT_DATA
            );
            if (!isPlaying) {
                audio.currentTime = 0;
                console.log(audio);
                audio.play();
            }
        })
    };

    const vals = useMemo(() => {
        const randVals = Array.from(props.questionUris).map((_, i) => i);
        // shuffle
        for (let i = randVals.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randVals[i], randVals[j]] = [randVals[j], randVals[i]];
        }
        randVals.splice(3, randVals.length);
        return randVals;
        // eslint-disable-next-line
    }, [props.questionUris, shuffle]);

    useEffect(() => {
        if (!ready) return;

        const questionAudio = questionAudios[vals[answerIdx]];
        questionAudio.currentTime = 0;
        questionAudio.play();
    }, [vals, ready, answerIdx, questionAudios]);

    const congratsRoutine = () => {
        setIsFinished(true);

        // cheer
        playAudio(goodAudios[vals[answerIdx]]).then(() => playAudio(yay));

        // reset
        setTimeout(() => {
            setIsFinished(false);
            setAnswerIdx(Math.floor(Math.random() * 3));
            setFlipped(new Array(3).fill(true));
            setShuffle(!shuffle);
        }, 8000);
    };

    const onClick = (i: number) => {
        if (!flipped[i] || isFinished) return;
        if (i === answerIdx) {
            setFlipped(flipped.map(_ => true));
            congratsRoutine();
        } else {
            setFlipped([...flipped.slice(0, i), false, ...flipped.slice(i + 1)]);
            playAudio(questionAudios[vals[answerIdx]]);
        }
    };

    if (!ready) {
        return <div><Restart onClick={() => setReady(true)} speak={false} /></div>;
    }

    return (
        <div className="find-grid-container">
            {vals.map((v, i) => (
                <div className={`find-grid-item ${isFinished && answerIdx === i ? 'answer' : ''}`} key={v} data-order={i}>
                    <Card
                        value={v}
                        isFlipped={flipped[i]}
                        imageUri={props.imageUris[v]}
                        onClick={() => onClick(i)}
                        cardBack={CardBack}
                        cardBackgroundColor={"#000"} />
                </div>
            ))
            }
        </div >
    );
}