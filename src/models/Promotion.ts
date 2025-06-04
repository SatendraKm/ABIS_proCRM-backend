import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../configs/sequelize';

interface PromotionAttributes {
  id: string;
  promotionCode: string;
  description: string;
  discountPercentage: number;
  criteria: string;
  validFrom: Date;
  validTo: Date;
  customerId?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type PromotionCreationAttributes = Optional<
  PromotionAttributes,
  'id' | 'customerId' | 'createdAt' | 'updatedAt'
>;

class Promotion
  extends Model<PromotionAttributes, PromotionCreationAttributes>
  implements PromotionAttributes
{
  public id!: string;
  public promotionCode!: string;
  public description!: string;
  public discountPercentage!: number;
  public criteria!: string;
  public validFrom!: Date;
  public validTo!: Date;
  public customerId?: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Promotion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    promotionCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    criteria: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Last 5 orders total ≥ 2000',
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Promotion',
    tableName: 'promotions',
    timestamps: true,
  }
);

export default Promotion;
