export interface SaleAttributes {
    id: number;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discount: number;
    finalPrice: number;
    customerId: string;
    customerName: string;
    paymentMethod: 'cash' | 'card' | 'mobile_payment' | 'credit';
    paymentStatus: 'pending' | 'partial' | 'paid';
    saleerId: string;
    SaleerName: string;
    saleDate: Date;
    invoiceNumber: string;
    taxAmount: number;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  export interface SaleFormData {

    productId: string;
  
    productName: string;
  
    quantity: number;
  
    unitPrice: number;
  
    totalPrice: number;
  
    discount: number;
  
    finalPrice: number;
  
    customerId: string;
  
    customerName: string;
  
    paymentMethod: string;
  
    paymentStatus: 'pending' | 'partial' | 'paid';
  
    saleerId: string;
  
    SaleerName: string;
  
    saleDate: Date;
  
    invoiceNumber: string;
  
    taxAmount: number;
  
    notes: string;
  
  }
export type PaymentMethod = 'cash' | 'card' | 'mobile_payment' | 'credit';