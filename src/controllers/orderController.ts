import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Order, OrderItem, Product, Customer } from '../models';

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const status = req.query.status as string;
    const customerId = req.query.customerId as string;
    const from = req.query.from as string;
    const to = req.query.to as string;

    const where: any = {};

    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (from && to) {
      where.orderedAt = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      offset,
      limit,
      include: [
        {
          model: Customer,
          attributes: ['id', 'name', 'email', 'phone'],
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

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        orders: rows,
        pagination: {
          total: count,
          page,
          limit,
          pages: totalPages,
        },
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
          attributes: ['id', 'name', 'email', 'phone', 'address'],
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
