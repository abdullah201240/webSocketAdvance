import { Server, Socket } from 'socket.io';

let ioInstance: Server | null = null;

export const registerSaleSocket = (io: Server) => {
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};

// Utility to emit new sale from anywhere in the app
export const emitNewSale = (saleData: any) => {
  if (ioInstance) {
    ioInstance.emit('new_sale', saleData);
  } else {
    console.warn('Socket.io instance not initialized');
  }
};

// Emit updated sale
export const emitSaleUpdated = (saleData: any) => {
  if (ioInstance) {
    ioInstance.emit('sale_updated', saleData);
  } else {
    console.warn('Socket.io instance not initialized');
  }
};

// Emit deleted sale id
export const emitSaleDeleted = (saleId: any) => {
  if (ioInstance) {
    ioInstance.emit('sale_deleted', saleId);
  } else {
    console.warn('Socket.io instance not initialized');
  }
};
