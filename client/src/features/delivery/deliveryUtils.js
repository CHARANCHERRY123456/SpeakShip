// Utility functions for delivery feature

export function calculatePrice(distance, priority) {
  const basePrice = 5 + (distance * 0.5);
  const multipliers = {
    'Normal': 1,
    'Urgent': 1.5,
    'Overnight': 2
  };
  return Math.round(basePrice * multipliers[priority] * 100) / 100;
}

export function calculateDeliveryTimeEstimate(distance, priority) {
  const now = new Date();
  const hoursToAdd = {
    'Normal': distance * 0.3,
    'Urgent': distance * 0.2,
    'Overnight': 24
  };
  if (priority === 'Overnight') {
    now.setDate(now.getDate() + 1);
    now.setHours(9, 0, 0, 0);
  } else {
    now.setHours(now.getHours() + hoursToAdd[priority]);
  }
  return now;
}
