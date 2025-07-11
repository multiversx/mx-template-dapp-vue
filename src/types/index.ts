export type { WidgetType } from './widget.types';

// Transaction types
export interface SignedTransactionType {
  hash: string;
  receiver: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  data?: string;
} 