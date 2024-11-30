import React from 'react';

import RoundedButton from '@components/base/RoundButton';
import { PALETTE } from '@metadata/palette';

export default function PopupButton(props: { children: React.ReactNode; onChange?: (open: boolean) => void; buttonProps: React.ComponentProps<typeof RoundedButton>; }) {
    const popupRef = React.useRef<HTMLDivElement>(null);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        props.onChange?.(open);
    }, [open]);

    return (
        <div
            tabIndex={0}
            onKeyUp={(e) => {
                if (e.key === 'Escape') setOpen(false);
            }}
        >
            <RoundedButton {...props.buttonProps} onClick={() => { props.buttonProps.onClick?.(); setOpen(!open); }} />
            <div
                ref={popupRef}
                style={{
                    position: "absolute",
                    right: open ? 'calc(1.5cm)' : `calc(${popupRef.current?.offsetWidth ?? 0}px + 1.5cm)`,
                    bottom: open ? 'calc(1.5cm)' : `calc(${popupRef.current?.offsetHeight ?? 0}px + 1.5cm)`,
                    display: open ? undefined : 'none',

                }}
            >
                <div style={{ cursor: 'pointer', color: PALETTE.NEUTRAL_GRAY, }} onClick={() => setOpen(false)}>
                    ✖
                </div>
                {props.children}
            </div>
        </div>
    )
}
