import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Order, OrderItem, Product, Customer } from '../models';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, customerId, customerPhoneNo } = req.query;

    const where: any = {};

    // Filter by orderId
    if (orderId) {
      where.id = Number(orderId);
    }

    // Filter by customerId
    if (customerId) {
      where.customerId = Number(customerId);
    }

    // If phone is provided, find customer first
    if (customerPhoneNo && !customerId) {
      const customer = await Customer.findOne({
        where: { phone: customerPhoneNo as string },
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer with the given phone number not found',
        });
      }

      where.customerId = customer.id;
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: Customer,
          attributes: ['name', 'email', 'phone'],
        },
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price'],
            },
          ],
        },
      ],
      order: [['orderedAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Customer,
          attributes: ['name', 'email', 'phone', 'address'],
        },
        {
          model: OrderItem,
          attributes: ['id', 'productId', 'quantity', 'price'],
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'description', 'price'],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
