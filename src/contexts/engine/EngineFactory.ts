import PythonEngine from "./PythonEngine";
import { Lang } from "types/code";

export default class EngineFactory {
    public create(lang: Lang) {
        switch (lang) {
            case 'python':
            default:
                return new PythonEngine();
        }
    }
}