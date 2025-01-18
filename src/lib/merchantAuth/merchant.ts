import { Document, Schema, model, models } from 'mongoose';

interface MerchantUser extends Document {
  businessName: string;
  email: string;
  password: string;
  description: string;
  address: string;
  logo: string;
  role: string;
}

const merchantSchema = new Schema<MerchantUser>({
  businessName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  description: { type: String, required: true },
  address: { type: String, required: true },
  logo: { type: String, required: false },
  role: { type: String, default: 'merchant' },
});

const Merchant =
  models?.Merchant || model<MerchantUser>('Merchant', merchantSchema);

export default Merchant;
