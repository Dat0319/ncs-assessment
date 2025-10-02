export interface ICreateLoyalty {
  point: number;
}

export interface LoyaltyModel {
  id: string;
  point: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
