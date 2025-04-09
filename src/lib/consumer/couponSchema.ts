export type ConsumerCoupon = {
  id: string;
  description: string;
  price: number;
  allowLimitedPurchase: boolean;
  validFrom: string;
  validTo: string;
  isDeactivated: boolean;
  image: string;
  title: string;
  quantity: number;
  category: string;
  accentColor:
    | 'perx-blue'
    | 'perx-canopy'
    | 'perx-rust'
    | 'perx-gold'
    | 'perx-silver';
  consumerAvailability:
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | '10'
    | '11'
    | '12'
    | '13'
    | '14'
    | '15';
  allowPointsPurchase: boolean;
  pointsAmount: number | null;
  merchant: {
    id: string;
    name: string;
    logo: string;
  };
};

export type PurchasedCoupon = Omit<
  ConsumerCoupon,
  'id' | 'merchant' | 'rank'
> & {
  id: string;
  couponId: string;
  consumerId: string;
  purchaseDate: string;
};
