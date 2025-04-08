'use server';
import { createClient } from '@/utils/supabase/server';

export async function handlePurchase(userId: string, amount = 0) {
  const supabase = await createClient();

  // 1. Get user info
  const { data: user, error: checkError } = await supabase
    .from('consumers')
    .select('*')
    .eq('id', userId)
    .single();

  if (checkError || !user) {
    throw new Error('User not found.');
  }

  // 2. Handle 'points' payment method
  if (amount > 0) {
  
    if (user.points_balance < amount) {
      throw new Error('Not enough points to complete the purchase.');
    }
  
    console.log("Deducting", amount, "points to", user.points_balance, "balance");
    user.points_balance = user.points_balance - amount;
    console.log("New balance", user.points_balance);
    await supabase
      .from('consumers')
      .update({
        points_balance: user.points_balance,
      })
      .eq('id', userId);
  }
  
  const newPoints = user.points_balance + 50;
  await supabase
    .from('consumers')
    .update({
      points_balance: newPoints,
      points_total: user.points_total + 50,
    })
    .eq('id', userId);

  // 3. If already purchased, just reward points and return
  if (user.has_purchased) {
    return;
  }

  // 4. Mark user as purchased
  await supabase
    .from('consumers')
    .update({ has_purchased: true })
    .eq('id', userId);

  // 5. Get latest consumer data (if needed for referrer)
  const { data: consumer } = await supabase
    .from('consumers')
    .select('*')
    .eq('id', userId)
    .single();

  // 6. Reward referrer
  if (consumer?.referrer_code) {
    const { data: referrer } = await supabase
      .from('consumers')
      .select('*')
      .eq('referral_code', consumer.referrer_code)
      .single();

    if (referrer) {
      const newPoints = referrer.points_balance + 50;

      await supabase
        .from('consumers')
        .update({
          points_balance: newPoints,
          points_total: referrer.points_total + 50,
        })
        .eq('id', referrer.id);

      // await grantAchievement(referrer.id, "Referral Bonus");
    }
  }
  await grantAchievement(consumer.id, 'First Purchase');
}

export async function grantAchievement(consumerId: string, code: string) {
  const supabase = await createClient();
  const { data: achievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('code', code)
    .single();

  if (!achievement) return;

  const { data: alreadyEarned } = await supabase
    .from('consumer_achievements')
    .select('*')
    .eq('consumer_id', consumerId)
    .eq('achievement_id', achievement.id);

  if (alreadyEarned?.length === 0) {
    await supabase.from('consumer_achievements').insert([
      {
        consumer_id: consumerId,
        achievement_id: achievement.id,
        date_earned: new Date(),
      },
    ]);

    // Add achievement points
    const { data: consumer } = await supabase
      .from('consumers')
      .select('*')
      .eq('id', consumerId)
      .single();

    if (consumer) {
      await supabase
        .from('consumers')
        .update({
          points_balance: consumer.points_balance + achievement.points,
          points_total: consumer.points_total + achievement.points,
        })
        .eq('id', consumerId);
    }
  }
}

export async function checkAchievements(consumerId: string) {
  const supabase = await createClient();

  const { data: checkData, error: checkError } = await supabase
    .from('consumers')
    .select('*')
    .eq('id', consumerId)
    .single();

  const { data: referrals } = await supabase
    .from('consumers')
    .select('*')
    .eq('referrer_code', checkData.referral_code)
    .eq('has_purchased', true);

  const referralCount = referrals?.length || 0;

  if (referralCount >= 10) await grantAchievement(consumerId, 'social_butterfly');
  if (referralCount >= 50) await grantAchievement(consumerId, 'referral_rockstar');

  const { data: consumer } = await supabase
    .from('consumers')
    .select('*')
    .eq('id', consumerId)
    .single();

  if (consumer?.points_total >= 1000) {
    await grantAchievement(consumerId, 'point_prodigy');
  }

  const { data: redemptions } = await supabase
    .from('coupon_redemptions')
    .select('*')
    .eq('consumer_id', consumerId);

  if ((redemptions?.length || 0) >= 10) {
    await grantAchievement(consumerId, 'coupon_connoisseur');
  }
}
