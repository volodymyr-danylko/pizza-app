
const initialState = {
	items: {},
	totalPrice: 0,
	totalCount: 0,
}

const getTotalPrice = arr => arr.reduce((sum, obj) => sum + obj.price, 0);

const cart = (state = initialState, action) => {
	switch (action.type) {
		case 'ADD_PIZZA_CART': {
			const currenPizzaItems = !state.items[action.payload.id]
				? [action.payload]
				: [...state.items[action.payload.id].items, action.payload]

			const newItems = {
				...state.items,
				[action.payload.id]: {
					items: currenPizzaItems,
					totalPrice: getTotalPrice(currenPizzaItems),
				}
			}

			const totalPrice = Object.keys(newItems).reduce((sum, key) => newItems[key].totalPrice + sum, 0);
			const totalCount = Object.keys(newItems).reduce((sum, key) => newItems[key].items.length + sum, 0);

			return {
				...state,
				items: newItems,
				totalCount,
				totalPrice,
			};
		}
		case 'SET_TOTAL_PRICE':
			return {
				...state,
				totalPrice: action.payload
			};
		case 'SET_TOTAL_COUNT':
			return {
				...state,
				totalCount: action.payload
			};
		case 'CLEAR_CART':
			return {
				items: {},
				totalPrice: 0,
				totalCount: 0,
			};
		case 'REMOVE_CART_ITEM': {
			const newItems = {
				...state.items
			}
			const currentTotalPrice = newItems[action.payload].totalPrice;
			const currentTotalCount = newItems[action.payload].items.length;
			delete newItems[action.payload];
			return {
				...state.items,
				items: newItems,
				totalPrice: state.totalPrice - currentTotalPrice,
				totalCount: state.totalCount - currentTotalCount,
			};
		}
		case 'PLUS_CART_ITEM': {
			const newItems = [...state.items[action.payload].items, state.items[action.payload].items[0]];
			const currentItemPrice = state.items[action.payload].items[0].price;
			return {
				...state,
				items: {
					...state.items,
					[action.payload]: {
						items: newItems,
						totalPrice: getTotalPrice(newItems)
					},
				},
				totalPrice: state.totalPrice + currentItemPrice,
				totalCount: state.totalCount + 1,
			};
		}
		case 'MINUS_CART_ITEM': {
			const oldItems = state.items[action.payload].items;
			const newItems = oldItems.length > 1 ? state.items[action.payload].items.slice(1) : oldItems;
			const currentItemPrice = state.items[action.payload].items[0].price;
			const oldPrice = getTotalPrice(oldItems);
			const totalPrice = oldPrice > currentItemPrice ? state.totalPrice - currentItemPrice : state.totalPrice;
			const oldCount = oldItems.length > 1 ? state.totalCount - 1 : state.totalCount;

			return {
				...state,
				items: {
					...state.items,
					[action.payload]: {
						items: newItems,
						totalPrice: getTotalPrice(newItems)
					},
				},
				totalPrice,
				totalCount: oldCount,
			};
		}
		default:
			return state;
	}
};

export default cart;
