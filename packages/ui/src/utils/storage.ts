export const DIGIKIT_STORAGE_KEYS = {
  cart: 'digikit-cart',
  cartQty: 'digikit-cart-qty',
  favorites: 'digikit-favs',
  user: 'digikit-user',
  addresses: 'digikit-addresses',
  checkout: 'digikit-checkout',
  viewed: 'digikit-viewed',
  recents: 'digikit-recents',
  orders: 'digikit-orders',
} as const;

export const DIGIKIT_STORAGE_EVENTS = {
  cart: 'cart:changed',
  favorites: 'favs:changed',
  user: 'user:changed',
  addresses: 'addresses:changed',
  orders: 'orders:changed',
} as const;
