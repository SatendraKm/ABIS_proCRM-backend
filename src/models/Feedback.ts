import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../configs/sequelize';

interface FeedbackAttributes {
  id: number;
  customerId: number;
  orderId: number;
  rating: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type FeedbackCreationAttributes = Optional<
  FeedbackAttributes,
  'id' | 'description' | 'createdAt' | 'updatedAt'
>;

class Feedback
  extends Model<FeedbackAttributes, FeedbackCreationAttributes>
  implements FeedbackAttributes
{
  public id!: number;
  public customerId!: number;
  public orderId!: number;
  public rating!: number;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init(
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedbacks',
    timestamps: true,
  }
);

export default Feedback;
