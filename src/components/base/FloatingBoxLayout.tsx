import React from 'react';

import FloatingBox from "./FloatingBox";

export default function FloatingBoxLayout(props: { children: React.ReactNode; floatingBox: React.ReactNode; }) {
    const [scrollTop, setScrollTop] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrollTop(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div style={{ height: '100%', }}>
            <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
                <div>{props.children}</div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    // position: 'absolute',
                    // top: scrollTop + 10, // 스크롤 위치에 따라 `floatingBox` 위치 변경
                    // right: 10,
                    zIndex: 1,
                }}
            >
                {props.floatingBox}
            </div>
        </div>
    );

}
