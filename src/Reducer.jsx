export default function reducer(state = { stock: [], sold: [], cart: [] }, action) {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        stock: action.payload,
      };
    case 'ADD_TO_CART':
      console.log({
        ...state,
        cart: [...state.cart, action.payload],
      })
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
       case 'REMOVE_FROM_CART':
      const productIdToRemove = action.payload;
      console.log({
        ...state,
        cart: state.cart.filter(item => item.id !== productIdToRemove),
      })
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== productIdToRemove),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

      case 'UPDATE_CART_QUANTITY':
      const { id: cartItemId, quantity: cartItemQuantity } = action.payload;
      const updatedCartItems = state.cart.map(item =>
        item.id === cartItemId ? { ...item, quantity: cartItemQuantity } : item
      );

      return {
        ...state,
        cart: updatedCartItems,
      };

    case 'UPDATE_QUANTITY':
      const { id: stockItemId, quantity: stockItemQuantity } = action.payload;
      const updatedStockItems = state.stock.map(item =>
        item.id === stockItemId ? { ...item, quantity: stockItemQuantity } : item
      );

      return {
        ...state,
        stock: updatedStockItems,
      };
    case 'COMPLETE_PURCHASE':
      // Assuming action.payload contains the list of products sold and other relevant details
      // Update the sold table with the sold products
      const updatedSold = [...state.sold, ...action.payload];
      // Reduce the stock quantity in the stock table for the sold products
      const updatedStock = state.stock.map(product => {
        const soldProduct = action.payload.find(soldItem => soldItem.id === product.id);
        if (soldProduct) {
          return {
            ...product,
            quantity: product.quantity - soldProduct.quantity,
          };
        } else {
          return product;
        }
      });
      return {
        ...state,
        sold: updatedSold,
        stock: updatedStock,
        cart: [], // Clear the cart after completing the purchase
      };
    default:
      return state;
  }
}
