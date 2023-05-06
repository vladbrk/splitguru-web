import Product from './Product'
import Person from './Person'
import Debt from './Debt'
import Settlement from './Settlement'

enum ReceiptActionType {
    ADD_PRODUCT = "ADD_PRODUCT",
    UPDATE_PRODUCTS = "UPDATE_PRODUCTS",
    ADD_MEMBER = "ADD_MEMBER",

    SET_USER_NAME = "SET_USER_NAME",
    UPDATE_USER = "UPDATE_USER",
    UPDATE_MEMBERS = "UPDATE_MEMBERS",
    GET_USER = "GET_USER",
    SET_SETTLEMENT = "SET_SETTLEMENT",

    SET_ROOM = "SET_ROOM"
}

export interface ReceiptAction {
    type: string,
    payload: string,
    userName: string,
    product: Product,
    products : Array<Product>,
    member: Person,
    members: Array<Person>,
    room: string,
    settlement: Settlement
}

export interface ReceiptState {
    user: Person,
    members: Array<Person>,
    products : Array<Product>,
    room: string,
    settlement: Settlement,
    userSettlement: Settlement
}

//const members : Array<Person> = [new Person('0', 'Anton'), new Person('1', 'Maria'), new Person('2', 'Gregory')]
//const members : Array<Person> = []

const initialState: ReceiptState = {
    user: new Person('', ''),
    members: [],
    //products: [new Product('1', 'Apple', 15, [members[0], members[2]], [members[0], members[1], members[2]]), new Product('2', 'Coffee', 20, [members[1]], [members[0], members[1]])]
    products: [],
    room: '',
    settlement: new Settlement(),
    userSettlement: new Settlement()
}

const receipt = (state: ReceiptState = initialState, action: ReceiptAction) : ReceiptState => {
    switch(action.type) {
        case ReceiptActionType.ADD_PRODUCT : {
            const products = state.products
            products.push(action.product)
            state.products = products
            return {...state}
        }
        case ReceiptActionType.UPDATE_PRODUCTS : {
            state.products = action.products
            return {...state}
        }
        case ReceiptActionType.ADD_MEMBER : {
            const members = state.members
            console.log("ADD MEMBER " + action.member)
            members.push(action.member)
            state.members = members
            return {...state}
        }

        case ReceiptActionType.SET_USER_NAME : {
            const user = state.user
            user.name = action.userName
            state.user = user
            return {...state}
        }

        case ReceiptActionType.SET_SETTLEMENT : {

            let userSettlement: Settlement = new Settlement();
            let userId = state.user.id;
            userSettlement.debts = action.settlement.debts.filter((el: Debt, index, arr) => el.debtor.id === userId || el.recepient.id === userId)

            state.settlement = action.settlement
            state.userSettlement = userSettlement
            return {...state}
        }

        case ReceiptActionType.UPDATE_USER : {

            console.log("UPDATE_USER " + JSON.stringify(action.member))
            let m: Person = action.member
            let newUser = new Person(m.id as string, m.name as string)
            state.user = newUser


            /*state.members = state.members.map((old: Person) => old.id === newUser.id ? newUser : old)
            console.log("UPDATED_USER " + JSON.stringify(state.user))*/
            return {...state}
        }

        case ReceiptActionType.UPDATE_MEMBERS : {
            state.members = action.members
            return {...state}
        }

        case ReceiptActionType.SET_ROOM : {
            state.room = action.room
            return {...state}
        }


        default:
            return state
    }
}


export default receipt