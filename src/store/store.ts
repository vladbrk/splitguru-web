import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers/index'
import thunk from 'redux-thunk'
import { ReceiptState } from './reducers/receipt'
import Product from './reducers/Product'
import Person from './reducers/Person'


/*const initialState: ReceiptState = {
    products: [new Product('1', 'Apple', 10, [new Person('1', 'Anton')], [new Person('1', 'Anton'), new Person('2', 'Maria')]), new Product('2', 'Coffee', 20, [new Person('2', 'Maria')], [new Person('1', 'Anton'), new Person('2', 'Maria')])]
}*/

const store = createStore(reducers, /*{ receipt: initialState },*/ applyMiddleware(thunk))

export default store