import "./Card.css";
import defaultCardBack from "../card-back.png";
import { FastAverageColor } from 'fast-average-color';
import { useEffect, useRef, useState } from "react";


export interface CardProps {
    value: number;
    imageUri: string;
    isFlipped: boolean;
    onClick: () => void;
    cardBack?: string;
    cardBackgroundColor?: string;
}


export function Card({ value, isFlipped, onClick, imageUri, cardBack, cardBackgroundColor }: CardProps) {
    const [color, setColor] = useState<string | null>(null);

    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (imgRef.current === null) return;
        const fac = new FastAverageColor();
        fac.getColorAsync(imgRef.current)
            .then(c => setColor(c.hex));
    }, [imgRef, setColor]);

    const flippedStyle = color ? { backgroundColor: color } : {};
    const unflippedStyle = cardBackgroundColor ? { backgroundColor: cardBackgroundColor } : {};

    return (
        <figure className={`flip-card ${isFlipped ? "flip-card-active" : ""}`} onClick={onClick}>
            <div className="flip-card-inner">
                <div className="flip-card-front" style={unflippedStyle}>
                    <img className="flip-card-img" src={cardBack || defaultCardBack} alt="Card" />
                </div>
                <div className="flip-card-back" style={flippedStyle}>
                    <img ref={imgRef} className="flip-card-img" src={imageUri} alt={value.toString()} />
                </div>
            </div>
        </figure >
    )
}