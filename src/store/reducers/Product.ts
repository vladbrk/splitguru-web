import Person from './Person'

export default class Product {
    id?: string
    name?: string
    price?: number
    payers?: Array<Person>
    consumers?: Array<Person>

    constructor(id: string, name: string, price: number, payers: Array<Person>, consumers: Array<Person>) {
        this.id = id
        this.name = name
        this.price = price
        this.payers = payers
        this.consumers = consumers
    }
}



