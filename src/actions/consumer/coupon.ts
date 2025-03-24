import { createClient } from "@/utils/supabase/server";

export async function getCoupons() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select(`
      id, 
      title, 
      description, 
      price, 
      image, 
      merchant:merchants (name, logo)
    `);

  if (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }

  return data.map((coupon) => ({
    ...coupon,
    merchant: Array.isArray(coupon.merchant) ? coupon.merchant[0] || { name: "Unknown", logo: "" } : coupon.merchant,
  }));
}
