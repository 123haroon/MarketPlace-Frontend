import { create } from "zustand";

export type CartProduct = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export type CartItem = CartProduct & {
  quantity: number;
  color?: string;
  variant?: string;
};

type CartStore = {
  cart: CartItem[];

  addToCart: (
    product: CartProduct,
    quantity: number,
    color?: string,
    variant?: string,
  ) => void;

  removeFromCart: (id: number) => void;

  updateQuantity: (id: number, quantity: number) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (product, quantity, color, variant) =>
    set((state) => {
      const existingItem = state.cart.find(
        (item) =>
          item.id === product.id &&
          item.color === color &&
          item.variant === variant,
      );

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id &&
            item.color === color &&
            item.variant === variant
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item,
          ),
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            ...product,
            quantity,
            color,
            variant,
          },
        ],
      };
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  // ADD THIS
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),

  clearCart: () =>
    set({
      cart: [],
    }),
}));
