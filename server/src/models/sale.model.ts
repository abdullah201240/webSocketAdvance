import { DataTypes, Model, Optional } from 'sequelize';
import db from '../config/sequelize';

interface SaleAttributes {
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
}

interface SaleCreationAttributes extends Optional<SaleAttributes, 'id' | 'notes' | 'taxAmount' | 'discount'> {}

class Sale extends Model<SaleAttributes, SaleCreationAttributes> 
  implements SaleAttributes {
  public id!: number;
  public productId!: string;
  public productName!: string;
  public quantity!: number;
  public unitPrice!: number;
  public totalPrice!: number;
  public discount!: number;
  public finalPrice!: number;
  public customerId!: string;
  public customerName!: string;
  public paymentMethod!: 'cash' | 'card' | 'mobile_payment' | 'credit';
  public paymentStatus!: 'pending' | 'partial' | 'paid';
  public saleerId!: string;
  public SaleerName!: string;
  public saleDate!: Date;
  public invoiceNumber!: string;
  public taxAmount!: number;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    finalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'mobile_payment', 'credit'),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'partial', 'paid'),
      defaultValue: 'pending',
    },
    saleerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SaleerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    taxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize: db,
    modelName: 'Sale',
    tableName: 'sales',
    timestamps: true,
    indexes: [
      {
        fields: ['invoiceNumber'],
        unique: true,
      },
      {
        fields: ['customerId'],
      },
      {
        fields: ['saleerId'],
      },
      {
        fields: ['saleDate'],
      },
    ],
  }
);

export default Sale;