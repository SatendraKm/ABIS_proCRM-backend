import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../configs/sequelize';

interface UserAttributes {
  id: number; // Changed from string to number for auto-increment
  EmployeeId: string;
  EmployeePhoneNumber: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number; // Changed from string to number
  public name!: string;
  public EmployeeId!: string;
  public EmployeePhoneNumber!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      // Removed invalid defaultValue
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    EmployeeId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    EmployeePhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
