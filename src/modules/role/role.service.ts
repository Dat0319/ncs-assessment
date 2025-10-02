/**
 * Role Service
 * @module Role Controller
 * @description Config controller
 */
import { getCustomRepository } from 'typeorm';
import { CreateRoleParams } from './role.model';
import { RoleRepository } from './role.repository';

export class RoleService {
  private static instance: RoleService;
  private roleRepository: RoleRepository;

  constructor() {
    if (RoleService.instance) {
      return RoleService.instance;
    }

    this.roleRepository = getCustomRepository(RoleRepository);
    RoleService.instance = this;
  }

  /**
   * @method create
   * @description Create new role
   */
  async create(params: { user: Express.TokenModel; body: CreateRoleParams }) {
    const attributeIds: string[] = [];
    const productIds: string[] = [];
    const productsMap = new Map<string, any>();
    for (let i = 0, total = params.body.products.length; i < total; i++) {
      const product = params.body.products[i];
      productIds.push(product.id);
      for (
        let j = 0, total = product.productAttributes.length;
        j < total;
        j++
      ) {
        productsMap.set(
          product.productAttributes[j].id,
          product.productAttributes[j]
        );
        attributeIds.push(product.productAttributes[j].id);
      }
    }
    return this.roleRepository.manager.transaction(async (manager) => {
      const roleParams: {
        price;
        discountPrice;
        quantity;
        roleItems;
        shippingAddress;
        user;
        fullName: string;
      } = {
        price: 0,
        discountPrice: 0,
        quantity: 0,
        roleItems: [],
        shippingAddress: params.body.shippingAddress,
        user: params.user.id,
        fullName: `${params.user.firstName} ${params.user.lastName}`,
      };

      return manager.save(this.roleRepository.create(roleParams));
    });
  }

  /**
   * @method list
   * @description Get list
   */
  async list() {
    return;
  }

  /**
   * @method getById
   * @description Get detail by id
   */
  async getById() {
    return;
  }

  /**
   * @method updateById
   * @description Update by id
   */
  async updateById() {
    return;
  }

  /**
   * @method deleteById
   * @description Delete by id
   */
  async deleteById() {
    return;
  }
}
