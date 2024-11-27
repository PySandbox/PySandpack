import { python } from '@codemirror/lang-python';
// import { basicSetup } from '@codemirror/basic-setup';
import { type Extension } from '@uiw/react-codemirror';

import { Lang } from 'types/code';

export default class EditorExtensionFactory {
    public create(lang: Lang): Extension[] {
        switch (lang) {
            case 'python':
                return [python()];
            default:
                return [];
        }
    }
}
