import { useEffect, useMemo } from "react";
import RestartIcon from "../restart.png";
import "./Restart.css";

export interface RestartProps {
    onClick: () => void;
    speak: boolean;
}

const YAY_URI = `${window.location.pathname}assets/yay!.mp3`;

export function Restart({ onClick, speak }: RestartProps) {
    const yay = useMemo(() => new Audio(YAY_URI), []);

    useEffect(() => {
        if (!speak) return;
        const listener = () => {
            yay.play();
        };
        yay.addEventListener("canplaythrough", listener);
        return () => {
            yay.removeEventListener("canplaythrough", listener);
        };

    }, [yay, speak]);

    return (
        <div className="restart-modal">
            <button className="restart-button" onClick={onClick}>
                <img src={RestartIcon} alt="restart" />
            </button>
        </div>
    );
}