import { expect, test } from "@jest/globals"
import {
  addItem,
  decreaseItem,
  removeItem,
  getCartCount,
  getCartTotal,
} from "./cart.js"

test("adding a new product gives it quantity one", () => {
  const product = { _id: "p1", name: "Store setup", price: 500 }

  expect(addItem([], product)).toEqual([
    { ...product, qty: 1 },
  ])
})

test("adding an existing product increments its quantity", () => {
  const product = { _id: "p1", name: "Store setup", price: 500 }
  const cart = [{ ...product, qty: 1 }]

  expect(addItem(cart, product)).toEqual([
    { ...product, qty: 2 },
  ])
})

test("decreaseItem decreases the existing quantity of product by 1", ()=> {
  const product = { _id: "p1", name: "Store setup", price: 500, qty: 2}
  const cart = [{ ...product, qty: 2  }]
  expect(decreaseItem(cart, "p1")).toEqual([
    { ...product, qty: 1},
  ])
})

test("decreasing quantity from one removes the item", () => {
  const product = { _id: "p1", name: "Store setup", price: 500 }
  const cart = [{ ...product, qty: 1 }]

  expect(decreaseItem(cart, "p1")).toEqual([])
})

test("removing an item leaves the other items in the cart", () => {
  const product1 = { _id: "p1", name: "Store setup", price: 500, qty: 1 }
  const product2 = { _id: "p2", name: "SEO service", price: 300, qty: 2 }

  expect(removeItem([product1, product2], "p1")).toEqual([product2])
})

test("cart count and total include item quantities", () => {
  const cart = [
    { _id: "p1", price: 500, qty: 2 },
    { _id: "p2", price: 300, qty: 1 },
  ]

  expect(getCartCount(cart)).toBe(3)
  expect(getCartTotal(cart)).toBe(1300)
})


