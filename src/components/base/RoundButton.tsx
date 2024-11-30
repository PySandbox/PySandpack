import { PALETTE } from '@metadata/palette';
import React from 'react';

interface RoundedButtonProps {
    tooltip?: string;
    onClick?: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    color?: string;
}

export default function RoundedButton(props: RoundedButtonProps) {
    return (
        <button
            style={{
                backgroundColor: props.color ?? PALETTE.NEUTRAL_GRAY,
                opacity: props.disabled ? 0.1 : 0.3,
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                aspectRatio: '1',
                width: '1cm',
                cursor: props.disabled ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                lineHeight: '1',
                verticalAlign: 'middle',
            }}
            onClick={props.onClick}
            disabled={props.disabled}
            title={props.tooltip}
        >
            {props.children}
        </button>
    );
}
