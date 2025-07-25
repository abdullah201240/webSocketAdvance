'use client';
import { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { SaleAttributes, SaleFormData, PaymentMethod } from '@/types/sales';
import { SalesTable } from '@/components/sale/SalesTable';
import { SalesForm } from '@/components/sale/SalesForm';
import { SalesDetails } from '@/components/sale/SalesDetails';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import socket from "../utils/socket";

export default function SalesPage() {
  const [sales, setSales] = useState<SaleAttributes[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleAttributes | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{type: 'success' | 'error', title: string, description: string} | null>(null);

  // Fetch sales from API on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/sales', { method: 'GET' })
      .then(res => res.json())
      .then(data => setSales(data.sales || []))
      .catch(() => setAlert({ type: 'error', title: 'Error', description: 'Failed to fetch sales.' }));
  }, []);

  // WebSocket real-time updates
  useEffect(() => {
    const handleNewSale = (sale: SaleAttributes) => {
      setSales(prev => [sale, ...prev.filter(s => s.id !== sale.id)]);
    };
    const handleSaleUpdated = (sale: SaleAttributes) => {
      setSales(prev => prev.map(s => s.id === sale.id ? sale : s));
    };
    const handleSaleDeleted = (id: number) => {
      setSales(prev => prev.filter(s => s.id !== id));
    };
    socket.on('new_sale', handleNewSale);
    socket.on('sale_updated', handleSaleUpdated);
    socket.on('sale_deleted', handleSaleDeleted);
    return () => {
      socket.off('new_sale', handleNewSale);
      socket.off('sale_updated', handleSaleUpdated);
      socket.off('sale_deleted', handleSaleDeleted);
    };
  }, []);

  // Auto-dismiss alert after 1 second
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Calculate statistics
  const totalSales = sales.reduce((sum, sale) => sum + sale.finalPrice, 0);
  const totalTransactions = sales.length;
  const paidSales = sales.filter(sale => sale.paymentStatus === 'paid').length;
  const averageSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const handleCreateSale = () => {
    setSelectedSale(null);
    setShowForm(true);
  };

  const handleEditSale = (sale: SaleAttributes) => {
    setSelectedSale(sale);
    setShowForm(true);
  };

  const handleViewSale = (sale: SaleAttributes) => {
    setSelectedSale(sale);
    setShowDetails(true);
  };

  const handleDeleteSale = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const res = await fetch(`http://localhost:8080/api/sales/${deleteId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(); 
        setAlert({
          type: "success",
          title: "Sale deleted",
          description: "The sale has been successfully deleted.",
        });
        setSales(prev => prev.filter(s => s.id !== deleteId));
      } catch {
        setAlert({
          type: "error",
          title: "Delete failed",
          description: "Could not delete the sale.",
        });
      }
      setDeleteId(null);
      setShowForm(false);
    }
  };

  const isPaymentMethod = (method: string): method is PaymentMethod => {
    return ['cash', 'card', 'mobile_payment', 'credit'].includes(method);
  };

  const handleSubmitForm = async (data: SaleFormData) => {
    if (!isPaymentMethod(data.paymentMethod)) {
      setAlert({
        type: "error",
        title: "Invalid Payment Method",
        description: "Please select a valid payment method.",
      });
      return;
    }
    try {
      if (selectedSale) {
        // Update existing sale
        const res = await fetch(`http://localhost:8080/api/sales/${selectedSale.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        setAlert({
          type: "success",
          title: "Sale updated",
          description: "The sale has been successfully updated.",
        });
      } else {
        // Create new sale
        const res = await fetch('http://localhost:8080/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error();
        setAlert({
          type: "success",
          title: "Sale created",
          description: "The new sale has been successfully created.",
        });
      }
      setShowForm(false);
    } catch {
      setAlert({
        type: "error",
        title: "Error",
        description: "Failed to save sale.",
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedSale(null);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    setSelectedSale(null);
  };

  const handleDetailsEdit = () => {
    setShowDetails(false);
    setShowForm(true);
  };

  // Handle inline status change
  const handleStatusChange = async (saleId: number, newStatus: string) => {
    const saleToUpdate = sales.find(s => s.id === saleId);
    if (!saleToUpdate) return;
    try {
      const res = await fetch(`http://localhost:8080/api/sales/${saleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...saleToUpdate, paymentStatus: newStatus }),
      });
      if (!res.ok) throw new Error();
      setSales(prev => prev.map(s => s.id === saleId ? { ...s, paymentStatus: newStatus as SaleAttributes['paymentStatus'] } : s));
      setAlert({
        type: 'success',
        title: 'Status updated',
        description: 'Payment status updated successfully.',
      });
    } catch {
      setAlert({
        type: 'error',
        title: 'Update failed',
        description: 'Could not update payment status.',
      });
    }
  };

  return (
    <>
      {alert && (
        <div
          className={`p-4 mb-4 rounded transition-opacity duration-500 mx-auto min-w-[300px] max-w-[400px] ${
            alert ? 'opacity-100' : 'opacity-0'
          } ${
            alert.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300 shadow-lg'
              : 'bg-red-100 text-red-800 border border-red-300 shadow-lg'
          }`}
        >
          <strong className="block text-lg font-semibold mb-1">{alert.title}</strong>
          <div>{alert.description}</div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-6">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg text-white">
            <div>
              <h1 className="text-4xl font-bold">Sales Management</h1>
              <p className="text-indigo-100 mt-2 text-lg">Manage your sales transactions and track performance</p>
            </div>
            <Button 
              onClick={handleCreateSale} 
              className="flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 text-lg shadow-lg"
            >
              <Plus className="h-4 w-4" />
              New Sale
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
           

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Total Transactions</CardTitle>
                <ShoppingCart className="h-6 w-6 text-blue-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalTransactions}</div>
                <p className="text-sm text-blue-100 mt-1">
                  Sales recorded this period
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Paid Sales</CardTitle>
                <Users className="h-6 w-6 text-purple-200" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{paidSales}</div>
                <p className="text-sm text-purple-100 mt-1">
                  {totalTransactions > 0 ? Math.round((paidSales / totalTransactions) * 100) : 0}% completion rate
                </p>
              </CardContent>
            </Card>

            
          </div>

          {/* Sales Table */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Sales Transactions
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                View and manage all your sales transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesTable
                sales={sales}
                onView={handleViewSale}
                onEdit={handleEditSale}
                onDelete={handleDeleteSale}
                onStatusChange={handleStatusChange} // NEW PROP
              />
            </CardContent>
          </Card>

          {/* Form Dialog */}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <div className="max-w-5xl w-full">  
              <SalesForm
                sale={selectedSale || undefined}
                onSubmit={handleSubmitForm}
                onCancel={handleFormCancel}
              />
            </div>
          </Dialog>

          {/* Details Dialog */}
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <div className="max-w-5xl w-full">
              {selectedSale && (
                <SalesDetails
                  sale={selectedSale}
                  onEdit={handleDetailsEdit}
                  onClose={handleDetailsClose}
                />
              )}
            </div>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the sale
                  and remove the data from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}