import React from 'react';

interface SplitLayoutProps {
    children: React.ReactNode[];
}

export default function SplitLayout(props: SplitLayoutProps) {
    const ref = React.useRef<HTMLDivElement>(null);

    const [widths, setWidths] = React.useState<number[]>(
        Array(props.children.length).fill(100 / props.children.length)
    );

    const handleMouseMove = React.useRef<(e: MouseEvent) => void>();
    const handleMouseUp = React.useRef<() => void>();

    const onMouseDown = (e: React.MouseEvent, widths: number[], index: number) => {
        e.preventDefault();

        const startX = e.clientX;
        const initialWidths = [...widths];

        handleMouseMove.current = (e: MouseEvent) => {
            const dx = e.clientX - startX;
            
            const containerWidth = ref.current?.offsetWidth;

            const deltaPercent = (dx / (containerWidth ?? 1000)) * 100;

            const newWidths = [...initialWidths];

            newWidths[index] = Math.max(5, initialWidths[index] + deltaPercent);
            newWidths[index + 1] = Math.max(5, initialWidths[index + 1] - deltaPercent);

            setWidths(newWidths);
        };

        handleMouseUp.current = () => {
            document.removeEventListener("mousemove", handleMouseMove.current!);
            document.removeEventListener("mouseup", handleMouseUp.current!);
        };

        document.addEventListener("mousemove", handleMouseMove.current!);
        document.addEventListener("mouseup", handleMouseUp.current!);
    };

    return (
        <div ref={ref} style={{ display: "flex", width: "100%", height: "100%", }}>
            {
                props.children.map((child, index) => (
                    <React.Fragment key={index}>
                        <div style={{ flexBasis: `${widths[index]}%`, }}>
                            {child}
                        </div>
                        {
                            index < props.children.length - 1 && (
                                <div
                                    onMouseDown={(e) => onMouseDown(e, widths, index)}
                                    style={{
                                        width: "0.1cm",
                                        cursor: "col-resize",
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
