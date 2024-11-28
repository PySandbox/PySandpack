import React from 'react';

import Overlay from "./Overlay";

export default function LoadingOverlay(props: { children: React.ReactNode; description?: React.ReactNode; }) {
    return (
        <Overlay visible={true}>
            {props.children}
            {/* <br />
            <div
                style={{
                    color: '#7e7e7e'
                }}
            >
                {props.description}
            </div> */}
        </Overlay>
    )
}
