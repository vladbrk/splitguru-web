import Product from '../reducers/Product'
import Person from '../reducers/Person'
import Settlement from '../reducers/Settlement'

export const addProduct = (product: Product) => {
    return (dispatch: any) => {
        dispatch({type: "ADD_PRODUCT", product: product})
    }
}

export const updateProducts = (products: Array<Product>) => {
    return (dispatch: any) => {
        dispatch({type: "UPDATE_PRODUCTS", products: products})
    }
}

export const addMember = (member: Person) => {
    return (dispatch: any) => {
        dispatch({type: "ADD_MEMBER", member: member})
    }
}

export const updateUser = (member: Person) => {
    return (dispatch: any) => {
        dispatch({type: "UPDATE_USER", member: member})
    }
}

export const updateMembers = (members: Array<Person>) => {
    return (dispatch: any) => {
        dispatch({type: "UPDATE_MEMBERS", members: members})
    }
}

export const setSettlement = (settlement: Settlement) => {
    return (dispatch: any) => {
        dispatch({type: "SET_SETTLEMENT", settlement: settlement})
    }
}

export const setRoom = (room: string) => { //delete username
    return (dispatch: any) => {
        dispatch({type: "SET_ROOM", room: room})
    }
}

export const setUserName = (userName: string) => {
    return (dispatch: any) => {
        dispatch({type: "SET_USER_NAME", userName: userName})
    }
}


