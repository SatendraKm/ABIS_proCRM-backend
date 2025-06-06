import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Order, OrderItem, Product, Customer } from '../models';

export const getAllOrderItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const orderId = req.query.orderId as string;
    const productId = req.query.productId as string;

    const where: any = {};
    if (orderId) where.orderId = orderId;
    if (productId) where.productId = productId;

    const { count, rows } = await OrderItem.findAndCountAll({
      where,
      offset,
      limit,
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'description', 'price'],
        },
        {
          model: Order,
          attributes: ['id', 'customerId', 'orderedAt'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        orderItems: rows,
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
