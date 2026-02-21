/**
 * Mobile Money - Abstraction multi-provider (mock par défaut)
 */
const PROVIDER = process.env.MOBILE_MONEY_PROVIDER || 'mock';

export interface MobileMoneyPaymentRequest {
  amount: number;
  currency: string;
  phone: string;
  reference: string;
  description?: string;
}

export interface MobileMoneyPaymentResult {
  success: boolean;
  transactionId?: string;
  status?: string;
  error?: string;
}

export async function initiateMobileMoneyPayment(
  req: MobileMoneyPaymentRequest
): Promise<MobileMoneyPaymentResult> {
  if (PROVIDER === 'mock') {
    return {
      success: true,
      transactionId: 'mm_mock_' + Date.now(),
      status: 'PENDING',
    };
  }
  // Intégration Orange Money, MTN, etc. via abstraction
  return { success: false, error: 'Provider non configuré' };
}
