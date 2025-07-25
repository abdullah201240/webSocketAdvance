'use client';
import { SaleAttributes } from '@/types/sales';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, CreditCard, Package, User, FileText, DollarSign } from 'lucide-react';

interface SalesDetailsProps {
  sale: SaleAttributes;
  onEdit: () => void;
  onClose: () => void;
}

export function SalesDetails({ sale, onEdit, onClose }: SalesDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      paid: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      partial: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      pending: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    } as const;
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-500 text-white'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const colors = {
      cash: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
      card: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
      mobile_payment: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white',
      credit: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    } as const;
    
    return (
      <Badge className={colors[method as keyof typeof colors] || 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'}>
        {method.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Sale Details - {sale.invoiceNumber}
        </DialogTitle>
        <DialogDescription>
          Complete information for this sale transaction
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="space-y-1">
            <div className="text-sm text-blue-600 font-medium">Invoice Number</div>
            <div className="font-bold text-lg text-gray-800">{sale.invoiceNumber}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-purple-600 font-medium">Sale Date</div>
            <div className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              {formatDate(sale.saleDate)}
            </div>
          </div>
        </div>

        {/* Customer & Salesperson */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-green-600" />
              Customer Information
            </div>
            <div className="space-y-2 pl-7">
              <div>
                <div className="text-sm text-green-600 font-medium">Customer ID</div>
                <div className="font-medium">{sale.customerId}</div>
              </div>
              <div>
                <div className="text-sm text-green-600 font-medium">Name</div>
                <div className="font-medium">{sale.customerName}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <User className="h-5 w-5 text-orange-600" />
              Salesperson Information
            </div>
            <div className="space-y-2 pl-7">
              <div>
                <div className="text-sm text-orange-600 font-medium">Salesperson ID</div>
                <div className="font-medium">{sale.saleerId}</div>
              </div>
              <div>
                <div className="text-sm text-orange-600 font-medium">Name</div>
                <div className="font-medium">{sale.SaleerName}</div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Product Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 text-purple-600" />
            Product Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
            <div>
              <div className="text-sm text-purple-600 font-medium">Product ID</div>
              <div className="font-medium">{sale.productId}</div>
            </div>
            <div>
              <div className="text-sm text-purple-600 font-medium">Product Name</div>
              <div className="font-medium">{sale.productName}</div>
            </div>
            <div>
              <div className="text-sm text-purple-600 font-medium">Quantity</div>
              <div className="font-medium">{sale.quantity}</div>
            </div>
            <div>
              <div className="text-sm text-purple-600 font-medium">Unit Price</div>
              <div className="font-medium">{formatCurrency(sale.unitPrice)}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            Payment Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
            <div>
              <div className="text-sm text-indigo-600 font-medium">Payment Method</div>
              <div className="font-medium">{getPaymentMethodBadge(sale.paymentMethod)}</div>
            </div>
            <div>
              <div className="text-sm text-indigo-600 font-medium">Payment Status</div>
              <div className="font-medium">{getStatusBadge(sale.paymentStatus)}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Financial Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <DollarSign className="h-5 w-5 text-green-600" />
            Financial Summary
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-7">
            <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border border-blue-300">
              <div className="text-sm text-blue-700 font-medium">Total Price</div>
              <div className="font-bold text-lg text-blue-800">{formatCurrency(sale.totalPrice)}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg border border-orange-300">
              <div className="text-sm text-orange-700 font-medium">Discount</div>
              <div className="font-bold text-lg text-orange-800">{formatCurrency(sale.discount)}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg border border-purple-300">
              <div className="text-sm text-purple-700 font-medium">Tax Amount</div>
              <div className="font-bold text-lg text-purple-800">{formatCurrency(sale.taxAmount)}</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border border-green-300">
              <div className="text-sm text-green-700 font-medium">Final Price</div>
              <div className="font-bold text-xl text-green-800">{formatCurrency(sale.finalPrice)}</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {sale.notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-lg font-semibold">Notes</div>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {sale.notes}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Timestamps */}
        {(sale.createdAt || sale.updatedAt) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              {sale.createdAt && (
                <div>
                  <div className="font-medium">Created</div>
                  <div>{formatDate(sale.createdAt)}</div>
                </div>
              )}
              {sale.updatedAt && (
                <div>
                  <div className="font-medium">Last Updated</div>
                  <div>{formatDate(sale.updatedAt)}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>
          Edit Sale
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}