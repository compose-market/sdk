import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
export declare class Health extends ClientSDK {
    check(options?: RequestOptions): Promise<models.HealthResponse>;
}
//# sourceMappingURL=health.d.ts.map