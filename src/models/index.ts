import { sequelize } from '../configs/sequelize';
import User from './User';
import Customer from './Customer';
import Order from './Order';
import OrderItem from './OrderItem';
import Product from './Product';
import Feedback from './Feedback';
import Enquiry from './Enquiry';
import Promotion from './Promotion';

// Associations

// Customer → Order
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

// Order → OrderItem
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Product → OrderItem
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Customer → Feedback
Customer.hasMany(Feedback, { foreignKey: 'customerId' });
Feedback.belongsTo(Customer, { foreignKey: 'customerId' });

// Order → Feedback
Order.hasOne(Feedback, { foreignKey: 'orderId' });
Feedback.belongsTo(Order, { foreignKey: 'orderId' });

// Customer → Enquiry
Customer.hasMany(Enquiry, { foreignKey: 'customerId' });
Enquiry.belongsTo(Customer, { foreignKey: 'customerId' });

// User (employee) → Enquiry (assigned)
User.hasMany(Enquiry, { foreignKey: 'assignedTo', as: 'assignedEnquiries' });
Enquiry.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });

// Customer → Promotion
Customer.hasMany(Promotion, { foreignKey: 'customerId' });
Promotion.belongsTo(Customer, { foreignKey: 'customerId' });

export { sequelize, User, Customer, Order, OrderItem, Product, Feedback, Enquiry, Promotion };
