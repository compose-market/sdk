import { ClientSDK } from "../lib/sdks.js";
import { Health } from "./health.js";
import { Inference } from "./inference.js";
import { Modality } from "./modality.js";
import { Models } from "./models.js";
export declare class SDK extends ClientSDK {
    private _health?;
    get health(): Health;
    private _models?;
    get models(): Models;
    private _modality?;
    get modality(): Modality;
    private _inference?;
    get inference(): Inference;
}
//# sourceMappingURL=sdk.d.ts.map