import zod from 'zod';

export const saleCreateValidator = zod.object({
    productId: zod.string(),
    productName: zod.string(),
    quantity: zod.number(),
    unitPrice: zod.number(),
    totalPrice: zod.number(),
    discount: zod.number(),
    finalPrice: zod.number(),
    customerId: zod.string(),
    customerName: zod.string(),
    paymentMethod: zod.enum(['cash', 'card', 'mobile_payment', 'credit']),
    paymentStatus: zod.enum(['pending', 'partial', 'paid']),
    saleerId: zod.string(),
    SaleerName: zod.string(),
    saleDate: zod.date(),
    invoiceNumber: zod.string(),
    taxAmount: zod.number(),
    notes: zod.string().optional(),
});