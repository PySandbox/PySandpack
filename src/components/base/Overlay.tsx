import React from 'react';

export default function Overlay(props: { children: React.ReactNode; visible?: boolean; cancelable?: boolean; }) {
    const [isVisible, setIsVisible] = React.useState(props.visible);

    const overlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        zIndex: 9999,
    };

    const contentStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    return (
        isVisible ? (
            <div style={overlayStyle} onClick={() => { props.cancelable && setIsVisible(false); }}>
                <div style={contentStyle}>
                    {props.children}
                </div>
            </div>
        ) :
        <></>
    );
}