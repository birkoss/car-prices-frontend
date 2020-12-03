export const formatPrice = (price) => {
    return price.toLocaleString('fr-CA', {
        style: 'currency',
        currency: 'CAD',
      }).replace(",00", ""); /* $2,500.00 */
}