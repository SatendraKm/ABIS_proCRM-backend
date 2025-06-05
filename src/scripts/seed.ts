import { sequelize } from '../configs/sequelize';
import { User, Customer, Product, Order, OrderItem, Feedback, Enquiry, Promotion } from '../models';

async function seed() {
  try {
    await sequelize.sync({ force: true }); // WARNING: Drops and recreates all tables

    // Create Users (employees)
    const passwordHash = 'securepassword123'; // Replace with hashed password in real case
    const users = await User.bulkCreate([
      {
        name: 'Ravi Sharma',
        EmployeeId: '10007845',
        email: 'ravi@chickendelivery.com',
        password: passwordHash,
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Meena Rathi',
        EmployeeId: '10005896',
        email: 'meena@chickendelivery.com',
        password: passwordHash,
        role: 'support',
        isActive: true,
      },
    ]);

    // Create Customers
    const customers = await Customer.bulkCreate([
      {
        name: 'Sagar Dhaba',
        email: 'sagardhaba@example.com',
        phone: '9999912345',
        address: 'Plot 45, NH-24, Ghaziabad',
        isActive: true,
      },
      {
        name: 'Fresh Mart',
        email: 'freshmart@example.com',
        phone: '9876543210',
        address: 'Shop 12, Sector 21 Market, Noida',
        isActive: true,
      },
      {
        name: 'Rohit Sharma',
        email: 'rohitsharma@example.com',
        phone: '9123456780',
        address: 'Flat 4B, Green Residency, Lucknow',
        isActive: true,
      },
    ]);

    // Create Products
    const products = await Product.bulkCreate([
      {
        name: 'Raw Chicken - 1kg',
        description: 'Fresh, farm-raised chicken, cleaned and packed.',
        price: 220,
        isActive: true,
      },
      {
        name: 'Boneless Chicken - 500g',
        description: 'Boneless chicken breast pieces, hygienically packed.',
        price: 180,
        isActive: true,
      },
      {
        name: 'Chicken Sausages - 250g',
        description: 'Ready-to-cook chicken sausages.',
        price: 120,
        isActive: true,
      },
    ]);

    // Create Orders
    const orders = await Order.bulkCreate([
      {
        customerId: customers[0].id,
        totalAmount: 620,
        orderedAt: new Date(),
        shippingAddress: customers[0].address,
        status: 'Delivered',
      },
      {
        customerId: customers[1].id,
        totalAmount: 780,
        orderedAt: new Date(),
        shippingAddress: customers[1].address,
        status: 'Dispatched',
      },
      {
        customerId: customers[2].id,
        totalAmount: 340,
        orderedAt: new Date(),
        shippingAddress: customers[2].address,
        status: 'Processing',
      },
    ]);

    // Create OrderItems
    await OrderItem.bulkCreate([
      // Order 1 - Sagar Dhaba
      { orderId: orders[0].id, productId: products[0].id, quantity: 2, price: 220 },
      { orderId: orders[0].id, productId: products[2].id, quantity: 1, price: 120 },

      // Order 2 - Fresh Mart
      { orderId: orders[1].id, productId: products[1].id, quantity: 3, price: 180 },
      { orderId: orders[1].id, productId: products[2].id, quantity: 2, price: 120 },

      // Order 3 - Rohit Sharma
      { orderId: orders[2].id, productId: products[0].id, quantity: 1, price: 220 },
      { orderId: orders[2].id, productId: products[1].id, quantity: 1, price: 180 },
    ]);

    // Create Feedback
    await Feedback.bulkCreate([
      {
        customerId: customers[0].id,
        orderId: orders[0].id,
        rating: 5,
        description: 'High quality chicken. Delivery was on time. Will reorder!',
      },
      {
        customerId: customers[2].id,
        orderId: orders[2].id,
        rating: 4,
        description: 'Good quality but packaging can be improved.',
      },
    ]);

    // Create Enquiries
    await Enquiry.bulkCreate([
      {
        customerId: customers[1].id,
        subject: 'Late Delivery',
        description: 'The last order took longer than expected.',
        status: 'Open',
        priority: 'Medium',
        assignedTo: users[1].id,
      },
      {
        customerId: customers[2].id,
        subject: 'New Product Request',
        description: 'Can you add chicken wings to the catalog?',
        status: 'Open',
        priority: 'Low',
        assignedTo: users[1].id,
      },
    ]);

    // Create Promotion
    await Promotion.create({
      promotionCode: 'CHICKENFEST10',
      description: '10% off for customers ordering more than ₹2000 in last 5 orders',
      discountPercentage: 10,
      criteria: 'Total of last 5 orders >= ₹2000',
      validFrom: new Date(),
      validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      customerId: customers[0].id,
      isActive: true,
    });

    console.log('🐔 Seed data for Chicken Supply CRM created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
