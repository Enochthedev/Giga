declare module 'flutterwave-node-v3' {
  interface FlutterwaveConfig {
    public_key: string;
    secret_key: string;
    encryption_key: string;
  }

  interface PaymentPayload {
    tx_ref: string;
    amount: number;
    currency: string;
    redirect_url: string;
    customer: {
      email: string;
      phonenumber?: string;
      name: string;
    };
    customizations?: {
      title?: string;
      description?: string;
      logo?: string;
    };
    meta?: Record<string, any>;
    payment_options?: string;
  }

  interface RefundPayload {
    id: string;
    amount?: number;
    comments?: string;
  }

  interface FlutterwaveResponse {
    status: string;
    message: string;
    data: any;
  }

  class Flutterwave {
    constructor(config: FlutterwaveConfig);

    Payment: {
      initiate(payload: PaymentPayload): Promise<FlutterwaveResponse>;
      verify(options: { id: string }): Promise<FlutterwaveResponse>;
    };

    Transaction: {
      refund(payload: RefundPayload): Promise<FlutterwaveResponse>;
    };
  }

  export = Flutterwave;
}
