export const STOCK_RESERVATION_TTL_MS = 15 * 60 * 1000;

export function isReservationActive(status: string, expiresAt: Date, now = Date.now()) {
  return status === "active" && expiresAt.getTime() > now;
}

export function coversReservation(reservationVariantId: number, reservationQuantity: number, variantId: number | null, quantity: number) {
  return variantId === reservationVariantId && quantity > 0 && quantity <= reservationQuantity;
}
