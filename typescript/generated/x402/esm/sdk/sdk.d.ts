import { ClientSDK } from "../lib/sdks.js";
import { ComposeKeys } from "./compose-keys.js";
import { Feedback } from "./feedback.js";
import { Health } from "./health.js";
import { Payments } from "./payments.js";
import { X402 } from "./x402.js";
export declare class SDK extends ClientSDK {
    private _health?;
    get health(): Health;
    private _x402?;
    get x402(): X402;
    private _composeKeys?;
    get composeKeys(): ComposeKeys;
    private _payments?;
    get payments(): Payments;
    private _feedback?;
    get feedback(): Feedback;
}
//# sourceMappingURL=sdk.d.ts.map