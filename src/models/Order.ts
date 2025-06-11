import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../configs/sequelize';

interface OrderAttributes {
  id: number;
  customerId: number;
  totalAmount: number;
  orderedAt: Date;
  shippingAddress?: string;
  status: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderCreationAttributes = Optional<
  OrderAttributes,
  'id' | 'shippingAddress' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public customerId!: number;
  public totalAmount!: number;
  public orderedAt!: Date;
  public shippingAddress?: string;
  public status!: string;
  public deletedAt?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    orderedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pending',
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    paranoid: true, // Enables soft deletes using deletedAt
  }
);

export default Order;
