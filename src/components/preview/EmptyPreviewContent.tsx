import React from 'react';

import Overlay from '@components/base/Overlay';
import Logo from '@components/common/Logo';

export default function EmptyPreviewContent() {
    const style: React.CSSProperties = {
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#7e7e7e',
    }

    return (
        <Overlay cancelable={false} visible={true}>
            <div style={style}>
                <div style={{ ...style, height: '7rem' }}>
                    <Logo />
                </div>
                <br />
                <div>
                    Run your codes and check the output here!
                </div>
            </div>
        </Overlay>
    )
}