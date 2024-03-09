export type TYPE_CHECKOUT_TRANSACTION = {
  plan: string;
  credits: number;
  amount: number;
  buyerId: string;
};

export type TYPE_CREATE_TRANSACTION = {
  amount: number;
  credits: number;
  plan: string;
  buyerId: string;
};
