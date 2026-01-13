import { OrderRepository } from "../repositories/order.repository";
import { OrderItemRepository } from "../repositories/order_item.repository";
import { ProductRepository } from "../repositories/product.repository";
import { Order } from "../models/order.model";
import { OrderItem } from "../models/order_item.model";

interface CreateOrderItemDto {
  product_id: number;
  quantity: number;
}

export class OrderService {
  private orderRepository: OrderRepository;
  private orderItemRepository: OrderItemRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.orderItemRepository = new OrderItemRepository();
    this.productRepository = new ProductRepository();
  }

  public async createOrder(userId: number, items: CreateOrderItemDto[]) {
    if (!items || items.length === 0) {
      throw new Error("No se proporcionaron items para la orden");
    }

    // Calcular el total y verificar stock
    let totalAmount = 0;
    const itemsToCreate = [];

    // Validamos productos y precios antes de crear nada
    for (const item of items) {
      const product = await this.productRepository.findById(item.product_id);
      if (!product) {
        throw new Error(`El producto con ID ${item.product_id} no se encontro`);
      }
      
      // Validamos el stock
      if (product.stock < item.quantity) {
        throw new Error(`El producto con ID ${item.product_id} no tiene stock suficiente`);
      }

      const price = Number(product.price);
      totalAmount += price * item.quantity;
      
      itemsToCreate.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: price
      });
    }

    // Crear la orden
    const newOrder = await this.orderRepository.create({
      user_id: userId,
      total_amount: totalAmount
    });

    // Crear los items de la orden y actualizar stock
    const createdItems = [];
    for (const item of itemsToCreate) {
      const createdItem = await this.orderItemRepository.create({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price_at_order
      });
      createdItems.push(createdItem);
      
      // Actualizar el stock del producto
      await this.productRepository.updateStock(item.product_id, item.quantity);
    }

    return {
      ...newOrder,
      items: createdItems
    };
  }

  public async getOrdersByUser(userId: number) {
    const orders = await this.orderRepository.findByUserId(userId);

    if (!orders) {
      throw new Error("No se encontraron ordenes para el usuario");
    }
    
    // Agregar los items a cada orden
    const ordersWithItems = [];
    for (const order of orders) {
      const items = await this.orderItemRepository.findByOrderId(order.id);
      ordersWithItems.push({
        ...order,
        items
      });
    }

    return ordersWithItems;
  }

  public async getOrderById(orderId: number) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("No se encontro la orden");
    }

    const items = await this.orderItemRepository.findByOrderId(orderId);
    return {
      ...order,
      items
    };
  }

  public async getAllOrders(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const { orders, total } = await this.orderRepository.findAll(limit, offset);
    
    // Agregar los items a cada orden
    const ordersWithItems = [];
    for (const order of orders) {
      const items = await this.orderItemRepository.findByOrderId(order.id);
      ordersWithItems.push({
        ...order,
        items
      });
    }

    return {
      data: ordersWithItems,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    };
  }
}
