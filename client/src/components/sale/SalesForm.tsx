'use client';
import { useState, useEffect } from 'react';
import { SaleAttributes, SaleFormData } from '@/types/sales';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SalesFormProps {
  sale?: SaleAttributes;
  onSubmit: (data: SaleFormData) => void;
  onCancel: () => void;
}

export function SalesForm({ sale, onSubmit, onCancel }: SalesFormProps) {
  const [formData, setFormData] = useState<SaleFormData>({
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    discount: 0,
    finalPrice: 0,
    customerId: '',
    customerName: '',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    saleerId: '',
    SaleerName: '',
    saleDate: new Date(),
    invoiceNumber: '',
    taxAmount: 0,
    notes: '',
  });

  useEffect(() => {
    if (sale) {
      setFormData({
        productId: sale.productId,
        productName: sale.productName,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        totalPrice: sale.totalPrice,
        discount: sale.discount,
        finalPrice: sale.finalPrice,
        customerId: sale.customerId,
        customerName: sale.customerName,
        paymentMethod: sale.paymentMethod,
        paymentStatus: sale.paymentStatus,
        saleerId: sale.saleerId,
        SaleerName: sale.SaleerName,
        saleDate: sale.saleDate,
        invoiceNumber: sale.invoiceNumber,
        taxAmount: sale.taxAmount,
        notes: sale.notes || '',
      });
    } else {
      // Generate invoice number for new sales
      const timestamp = new Date().getTime();
      setFormData(prev => ({
        ...prev,
        invoiceNumber: `INV-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}`,
        saleDate: new Date(),
      }));
    }
  }, [sale]);

  useEffect(() => {
    // Calculate totals when relevant fields change
    const total = formData.quantity * formData.unitPrice;
    const final = total - formData.discount;
    const tax = final * 0.1; // 10% tax rate

    setFormData(prev => ({
      ...prev,
      totalPrice: total,
      finalPrice: final,
      taxAmount: tax,
    }));
  }, [formData.quantity, formData.unitPrice, formData.discount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof SaleFormData, value: string | number | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{sale ? 'Edit Sale' : 'Create New Sale'}</DialogTitle>
        <DialogDescription>
          {sale ? 'Update the sale information below.' : 'Fill in the details to create a new sale.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invoice & Date */}
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="saleDate">Sale Date</Label>
            <Input
              id="saleDate"
              type="datetime-local"
              value={new Date(formData.saleDate).toISOString().slice(0, 16)}
              onChange={(e) => handleInputChange('saleDate', new Date(e.target.value))}
              required
            />
          </div>

          {/* Product Information */}
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              required
            />
          </div>

          {/* Customer Information */}
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              value={formData.customerId}
              onChange={(e) => handleInputChange('customerId', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              required
            />
          </div>

          {/* Salesperson Information */}
          <div className="space-y-2">
            <Label htmlFor="saleerId">Salesperson ID</Label>
            <Input
              id="saleerId"
              value={formData.saleerId}
              onChange={(e) => handleInputChange('saleerId', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="SaleerName">Salesperson Name</Label>
            <Input
              id="SaleerName"
              value={formData.SaleerName}
              onChange={(e) => handleInputChange('SaleerName', e.target.value)}
              required
            />
          </div>

          {/* Pricing Information */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unitPrice">Unit Price ($)</Label>
            <Input
              id="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Discount ($)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Payment Information */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleInputChange('paymentMethod', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={(value) => handleInputChange('paymentStatus', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calculated Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="space-y-2">
            <Label className="text-blue-700 font-medium">Total Price</Label>
            <div className="text-xl font-bold text-blue-800">${typeof formData.totalPrice === 'number' ? formData.totalPrice.toFixed(2) : '0.00'}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-purple-700 font-medium">Tax Amount (10%)</Label>
            <div className="text-xl font-bold text-purple-800">${typeof formData.taxAmount === 'number' ? formData.taxAmount.toFixed(2) : '0.00'}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-green-700 font-medium">Final Price</Label>
            <div className="text-2xl font-bold text-green-800 bg-green-100 px-3 py-1 rounded-md">${typeof formData.finalPrice === 'number' ? formData.finalPrice.toFixed(2) : '0.00'}</div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes about this sale..."
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {sale ? 'Update Sale' : 'Create Sale'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}