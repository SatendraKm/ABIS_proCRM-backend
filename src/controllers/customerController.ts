import { Request, Response, NextFunction } from 'express';
import { Customer } from '../models';
import { AppError } from '../utils/AppError';

import { Op, literal } from 'sequelize';
import { Order, OrderItem, Product } from '../models';

export const customers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = (req.query.search as string) || '';
    const isActive =
      req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const { count, rows } = await Customer.findAndCountAll({
      where,
      offset,
      limit,
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*) FROM Orders WHERE Orders.customerId = Customer.id
            )`),
            'totalOrders',
          ],
          [
            literal(`(
              SELECT IFNULL(SUM(totalAmount), 0) FROM Orders WHERE Orders.customerId = Customer.id
            )`),
            'totalSpent',
          ],
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        customers: rows,
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
export const getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findByPk(customerId, {
      attributes: {
        include: [
          [
            literal(`(
              SELECT COUNT(*) FROM Orders WHERE Orders.customerId = Customer.id
            )`),
            'totalOrders',
          ],
          [
            literal(`(
              SELECT IFNULL(SUM(totalAmount), 0) FROM Orders WHERE Orders.customerId = Customer.id
            )`),
            'totalSpent',
          ],
        ],
      },
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderItem,
              attributes: ['productId', 'quantity', 'price'],
            },
          ],
          order: [['orderedAt', 'DESC']],
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.params.id;

    const orders = await Order.findAll({
      where: { customerId },
      include: [
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

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getCustomerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [results]: any = await Customer.sequelize?.query(`
      SELECT 
        COUNT(*) AS totalCustomers,
        SUM(CASE WHEN isActive THEN 1 ELSE 0 END) AS activeCustomers,
        SUM(CASE WHEN isActive = FALSE THEN 1 ELSE 0 END) AS inactiveCustomers,
        (SELECT COUNT(*) FROM Orders) AS totalOrders,
        (SELECT IFNULL(SUM(totalAmount), 0) FROM Orders) AS totalRevenue,
        (SELECT IFNULL(AVG(totalAmount), 0) FROM Orders) AS avgOrderValue
      FROM Customers;
    `);

    res.status(200).json({ success: true, data: results[0] });
  } catch (error) {
    next(error);
  }
};

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [summary]: any = await Customer.sequelize?.query(`
      SELECT
        (SELECT COUNT(*) FROM Customers) AS totalCustomers,
        (SELECT COUNT(*) FROM Customers WHERE isActive = TRUE) AS activeCustomers,
        (SELECT COUNT(*) FROM Orders) AS totalOrders,
        (SELECT IFNULL(SUM(totalAmount), 0) FROM Orders) AS totalRevenue,
        (SELECT COUNT(*) FROM Products) AS totalProducts
    `);

    res.status(200).json({ success: true, data: summary[0] });
  } catch (error) {
    next(error);
  }
};

export const getCustomerSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.params.id;

    const customer = await Customer.findByPk(customerId, {
      attributes: ['id', 'name', 'email', 'phone', 'isActive'],
      include: [
        {
          model: Order,
          attributes: ['id', 'totalAmount', 'orderedAt', 'status'],
          order: [['orderedAt', 'DESC']],
          limit: 1,
        },
      ],
    });

    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    const [summary]: any = await Customer.sequelize?.query(
      `
      SELECT
        COUNT(*) AS totalOrders,
        IFNULL(SUM(totalAmount), 0) AS totalSpent
      FROM Orders
      WHERE customerId = ?
    `,
      { replacements: [customerId] }
    );

    res.status(200).json({
      success: true,
      data: {
        ...customer.toJSON(),
        totalOrders: summary[0].totalOrders,
        totalSpent: summary[0].totalSpent,
        latestOrder: (customer as any).Orders?.[0] || null,
      },
    });
  } catch (error) {
    next(error);
  }
};
