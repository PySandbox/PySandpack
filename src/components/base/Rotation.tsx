import React from 'react';

export default function Rotation(props: { children: React.ReactNode; }) {
    const [rotation, setRotation] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(function () {
            setRotation(function (prevRotation) {
                return (prevRotation + 10);
            });
        }, 100);

        return function () {
            clearInterval(interval);
        };
    }, []);

    const style = {
        display: 'inline-block',
        transform: 'rotate(' + rotation + 'deg)',
        transition: 'transform 0.1s ease-in-out',
    };

    return (
        <div style={style}>
            {props.children}
        </div>
    );
}
