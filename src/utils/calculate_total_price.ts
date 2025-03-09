import { InvoiceItems } from "../interfaces"

export default function calculateTotalItemPrices(items: InvoiceItems[]) {
  const price = items.reduce((acc, item) => {
    return acc + item.unit_price * item.quantity
  }, 0)
  return price
}
