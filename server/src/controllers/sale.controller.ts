import {Request, Response, NextFunction } from "express";
import  Sale  from "../models/sale.model";
import { saleCreateValidator } from "../validators/sale.validator";
import { emitNewSale } from '../services/socket';
import { emitSaleUpdated, emitSaleDeleted } from '../services/socket';
import { getCache, setCache, delCache } from '../services/redis';
import { publishToQueue } from '../services/rabbitmq';


export const addSale = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Convert saleDate to Date if it's a string
        if (typeof req.body.saleDate === 'string') {
            req.body.saleDate = new Date(req.body.saleDate);
        }
        const validatedData = saleCreateValidator.parse(req.body);
        const newSale = await Sale.create(validatedData);
        emitNewSale(newSale);
        // Publish to RabbitMQ for async cache invalidation or processing
        await publishToQueue('sales_events', { type: 'sale_added', sale: newSale });
        // Invalidate sales list cache
        await delCache('sales:list');
        res.status(201).json(newSale);
    }catch (error) {
        next(error);
    }


}  
export const getSales = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const cacheKey = `sales:list:${page}:${limit}`;
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.status(200).json(cached);
        }

        const { count, rows: sales } = await Sale.findAndCountAll({
            limit,
            offset,
        });

        const response = {
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            sales,
        };
        await setCache(cacheKey, response, 60); // cache for 60s
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const updateSale = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleId = req.params.id;
        const sale = await Sale.findByPk(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        // Convert saleDate to Date if it's a string
        if (typeof req.body.saleDate === 'string') {
            req.body.saleDate = new Date(req.body.saleDate);
        }
        // Optionally validate input here, or just update
        await sale.update(req.body);
        emitSaleUpdated(sale);
        // Publish to RabbitMQ for async cache invalidation or processing
        await publishToQueue('sales_events', { type: 'sale_updated', sale });
        // Invalidate all sales list cache (for simplicity)
        await delCache('sales:list');
        res.status(200).json(sale);
    } catch (error) {
        next(error);
    }
};

export const deleteSale = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const saleId = req.params.id;
        const sale = await Sale.findByPk(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        await sale.destroy();
        emitSaleDeleted(saleId);
        // Publish to RabbitMQ for async cache invalidation or processing
        await publishToQueue('sales_events', { type: 'sale_deleted', saleId });
        // Invalidate all sales list cache (for simplicity)
        await delCache('sales:list');
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        next(error);
    }
};