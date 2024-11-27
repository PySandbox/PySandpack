import React from 'react';

const floatingBoxStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    padding: '10px',
    zIndex: 10,
};

export default function FloatingBox(props: { children: React.ReactNode; }) {
    return (
        <div style={floatingBoxStyle} >
            {props.children}
        </div >
    )
}
