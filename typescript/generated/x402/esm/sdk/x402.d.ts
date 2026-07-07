import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class X402 extends ClientSDK {
    supported(options?: RequestOptions): Promise<models.FacilitatorSupportedResponse>;
    chainsList(options?: RequestOptions): Promise<models.FacilitatorChainsResponse>;
    paymentVerify(request: models.FacilitatorPaymentRequest, options?: RequestOptions): Promise<models.VerifyResponse>;
    paymentSettle(request: models.FacilitatorPaymentRequest, options?: RequestOptions): Promise<operations.PaymentSettleResponse>;
}
//# sourceMappingURL=x402.d.ts.map