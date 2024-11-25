
export default function MyButton(props: { onClick?: () => void; children: JSX.Element; }) {
    return (
        <>{props.children}</>
    )
}
