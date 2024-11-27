import PythonEngine from "./PythonEngine";
import { Lang } from "types/language";

export default class EngineFactory {
    public create(lang: Lang) {
        switch (lang) {
            case 'python':
                return new PythonEngine();
            default:
                return new PythonEngine();
        }
    }
}