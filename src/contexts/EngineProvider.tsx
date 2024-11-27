import React from 'react';

import { Engine } from 'types/engine';
import EngineFactory from './view-engine/EngineFactory';
import { Lang } from 'types/code';

export default function EngineProvider(props: { lang: Lang; children: (engine: Engine | null) => React.ReactNode; onReady?: (engine: Engine) => void; onError: (e: Error) => void; }) {
    const [engine, setEngine] = React.useState<Engine | null>(null);

    const uninitedEngine = React.useMemo(() => new EngineFactory().create(props.lang), []);

    React.useEffect(() => {
        engine && props.onReady?.(engine);
    }, [engine]);

    React.useEffect(() => {
        (async () => {
            try {
                // const initedEngine = await uninitedEngine.init();

                // setEngine(initedEngine);
            }
            catch (err) {
                setEngine(null);

                props.onError(err as Error);
            }
        })();
    }, []);

    return props.children(engine);
}
