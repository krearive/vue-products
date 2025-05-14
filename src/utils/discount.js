export function calculateDiscount(total, isMember, promoCode) {
  let discount = 0;

  if (total > 1000000) discount += 10;
  if (isMember) discount += 5;
  if (promoCode.toUpperCase() === 'DISKON20') discount += 20;

  if (discount > 50) discount = 50;

  const finalTotal = total * (1 - discount / 100);
  return {
    total,
    discount,
    finalTotal,
  }
}