import type { Payment } from '../../types';

export const paymentFixture: Payment = {
  id: 201,
  amount: 25,
  paymentStatus: 'PENDING',
  transactionRecordId: 'tx-201',
};

export const cancelledPaymentFixture: Payment = {
  ...paymentFixture,
  paymentStatus: 'CANCELLED',
};

