import React from 'react';

interface SplitLayoutProps {
    children: React.ReactNode[];
}

export default function SplitLayout(props: SplitLayoutProps) {
    const [widths, setWidths] = React.useState<number[]>(
        Array(props.children.length).fill(100 / props.children.length)
    );

    return (
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
            {
                props.children.map((child, index) => (
                    <React.Fragment key={index}>
                        <div style={{ flexBasis: `${widths[index]}%`, }}>
                            {child}
                        </div>
                        {
                            index < props.children.length - 1 && (
                                <div
                                    onMouseDown={(e) => {
                                    }}
                                    style={{
                                        width: "4px",
                                        // cursor: "col-resize",
                                        backgroundColor: "#ccc",
                                        zIndex: 1,
                                    }}
                                />
                            )
                        }
                    </React.Fragment>
                ))
            }
        </div>
    );
};
