import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Categories, SortPopup, PizzaBlock, PizzaLoadingBlock } from '../components';
import { setCategory, setSortBy } from '../redux/actions/filters'
import { fetchPizzas } from '../redux/actions/pizzas';


const categoryNames = [
	"М'ясні ",
	'Вегетаріанські',
	'Гриль',
	'Гострі',
	'Закриті'
];

const sortItems = [
	{ name: 'популярністю', type: 'popular' },
	{ name: 'ціною', type: 'price' },
	{ name: 'алфавітом', type: 'name' }
]

function Home() {
	const dispatch = useDispatch();
	const items = useSelector(({ pizzas }) => pizzas.items);
	const cartItems = useSelector(({ cart }) => cart.items);
	const isLoaded = useSelector(({ pizzas }) => pizzas.isLoaded);
	const { category, sortBy } = useSelector(({ filters }) => filters);

	React.useEffect(() => {
		dispatch(fetchPizzas(category, sortBy))
	}, [category, sortBy]);

	const onSelectCategory = React.useCallback(index => {
		dispatch(setCategory(index));
	}, [])

	const onSelectSortType = React.useCallback(type => {
		dispatch(setSortBy(type));
	}, [])

	const handleAddPizzaToCart = obj => {
		dispatch({
			type: 'ADD_PIZZA_CART',
			payload: obj
		})
	}


	return (
		<div className="container">
			<div className="content__top">
				<Categories
					activeCategory={category}
					onClickCategory={onSelectCategory}
					items={categoryNames}
				/>
				<SortPopup
					activeSortType={sortBy}
					items={sortItems}
					onClickSortType={onSelectSortType}
				/>
			</div>
			<h2 className="content__title">Всі піцци</h2>
			<div className="content__items">
				{
					isLoaded
						? items.map(obj => (
							<PizzaBlock
								onClickAddPizza={handleAddPizzaToCart}
								key={obj.id}
								addedCount={cartItems[obj.id] && cartItems[obj.id].items.length}
								isLoading={true}
								{...obj}
							/>
						))
						: Array(12).fill(0).map((_, index) => <PizzaLoadingBlock key={index} />)
				}
			</div>
		</div>
	)
}

export default Home
