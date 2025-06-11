import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../configs/sequelize';

interface CustomerFeedbackAttributes {
  id: number;
  customerId: number;
  orderId: number;
  subject?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  followUpDate?: Date;
  status?: 'open' | 'close';
  formtype: 'feedback' | 'complaint';
}

type CustomerFeedbackCreationAttributes = Optional<
  CustomerFeedbackAttributes,
  'id' | 'description' | 'createdAt' | 'updatedAt' | 'status'
>;

class CustomerFeedback
  extends Model<CustomerFeedbackAttributes, CustomerFeedbackCreationAttributes>
  implements CustomerFeedbackAttributes
{
  public id!: number;
  public customerId!: number;
  public orderId!: number;
  public subject!: string;
  public description?: string;
  public status?: 'open' | 'close';
  public formtype!: 'feedback' | 'complaint';
  public followUpDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CustomerFeedback.init(
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
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'close'),
      allowNull: true,
    },
    formtype: {
      type: DataTypes.ENUM('feedback', 'complaint'),
      allowNull: false,
    },
    followUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CustomerFeedback',
    tableName: 'customer_feedbacks',
    timestamps: true,
  }
);

export default CustomerFeedback;
