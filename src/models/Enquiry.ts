import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../configs/sequelize';

interface EnquiryAttributes {
  id: number;
  customerId: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type EnquiryCreationAttributes = Optional<EnquiryAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Enquiry
  extends Model<EnquiryAttributes, EnquiryCreationAttributes>
  implements EnquiryAttributes
{
  public id!: number;
  public customerId!: string;
  public subject!: string;
  public description!: string;
  public status!: string;
  public priority!: string;
  public assignedTo!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Enquiry.init(
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
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Open',
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Medium',
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Enquiry',
    tableName: 'enquiries',
    timestamps: true,
  }
);

export default Enquiry;
