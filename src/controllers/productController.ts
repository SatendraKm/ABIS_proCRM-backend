import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { Order, OrderItem, Product, Customer } from '../models';
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const search = (req.query.search as string) || '';
    const isActive =
      req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const minPrice = parseFloat(req.query.minPrice as string);
    const maxPrice = parseFloat(req.query.maxPrice as string);

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      where.price = { [Op.between]: [minPrice, maxPrice] };
    } else if (!isNaN(minPrice)) {
      where.price = { [Op.gte]: minPrice };
    } else if (!isNaN(maxPrice)) {
      where.price = { [Op.lte]: maxPrice };
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        products: rows,
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
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
