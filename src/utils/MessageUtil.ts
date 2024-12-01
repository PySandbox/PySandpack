import { Ext2PySpMessageProtocol, PySp2ExtMessageProtocol } from "types/message-protocol";

export function sendMsgToPySandpackFrom(target: Window, message: Ext2PySpMessageProtocol) {
    target.postMessage(message);
}

export function sendMsgFromPySandPackTo(target: Window, message: PySp2ExtMessageProtocol) {
    target.postMessage(message);
}
