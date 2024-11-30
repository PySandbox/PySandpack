import { PALETTE } from '@metadata/palette';
import React from 'react';

interface ButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    title?: string;
    children: React.ReactNode;
    color?: string;
}

function getFontColorBasedOnBackground(backgroundColor: string) {
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(backgroundColor);

    if (!rgb) return '#ffffff';

    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);

    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return brightness > 128 ? '#000' : '#fff';
}

export default function Button(props: ButtonProps) {
    const color = props.color ?? PALETTE.NEUTRAL_GRAY;

    const buttonStyle: React.CSSProperties = {
        display: 'inline-block',
        border: '2px solid ' + color,
        backgroundColor: color,//'transparent',
        color: getFontColorBasedOnBackground(color),
        opacity: '0.8',
        borderRadius: '7px',
        textAlign: 'center',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        padding: 5,
    };

    const handleMouseEnter = (e: React.MouseEvent) => {
        (e.target as HTMLElement).style.opacity = '0.7';
    };

    const handleMouseLeave = (e: React.MouseEvent) => {
        (e.target as HTMLElement).style.opacity = '0.8';
    };

    return (
        <button
            title={props.title}
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
