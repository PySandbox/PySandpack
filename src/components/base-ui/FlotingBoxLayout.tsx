import React from 'react';

import FloatingBox from "./FloatingBox";

export default function FlotingBoxLayout(props: { children: React.ReactNode; floatingBox: React.ReactNode; }) {
    const [scrollTop, setScrollTop] = React.useState(0);

    // 스크롤 이벤트 리스너 추가
    React.useEffect(() => {
        const handleScroll = () => {
            setScrollTop(window.scrollY); // 스크롤 위치 저장
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 이벤트 제거
        };
    }, []);

    return (
        <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
            <div
                style={{
                    position: 'absolute',
                    top: scrollTop + 10, // 스크롤 위치에 따라 `floatingBox` 위치 변경
                    left: 10,
                    zIndex: 1,
                }}
            >
                {props.floatingBox}
            </div>
            <div>{props.children}</div>
        </div>
    );

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'auto' }}>
            {props.children}
            <FloatingBox>
                {props.floatingBox}
            </FloatingBox>
        </div>
    )
}
