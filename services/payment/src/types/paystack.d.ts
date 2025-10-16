declare module 'paystack' {
  interface PaystackConfig {
    secretKey: string;
  }

  interface PaystackResponse {
    status: boolean;
    message: string;
    data: any;
  }

  interface TransactionInitializeData {
    email: string;
    amount: number;
    currency?: string;
    reference?: string;
    callback_url?: string;
    metadata?: Record<string, any>;
  }

  interface RefundData {
    transaction: string;
    amount?: number;
    currency?: string;
    customer_note?: string;
    merchant_note?: string;
  }

  export class Paystack {
    constructor(config: PaystackConfig);

    transaction: {
      initialize(data: TransactionInitializeData): Promise<PaystackResponse>;
      verify(reference: string): Promise<PaystackResponse>;
    };

    refund: {
      create(data: RefundData): Promise<PaystackResponse>;
    };
  }
}
