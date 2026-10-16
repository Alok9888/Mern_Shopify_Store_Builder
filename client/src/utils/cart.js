export function addItem(cart, product) {
  const existing = cart.find((item) => item._id === product._id)

  if (existing) {
    return cart.map((item) =>
      item._id === product._id
        ? { ...item, qty: item.qty + 1 }
        : item
    )
  }

  return [...cart, { ...product, qty: 1 }]
}

export function removeItem(cart, id) {
  return cart.filter((item) => item._id !== id)
}

export function decreaseItem(cart, id) {
  return cart
    .map((item) => {
      if (item._id !== id) return item
      if (item.qty === 1) return null
      return { ...item, qty: item.qty - 1 }
    })
    .filter(Boolean)
}

export function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0)
}

export function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0)
}