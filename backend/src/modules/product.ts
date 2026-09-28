export interface Product {
    id: number
    name: string
    type: typeOfProduct
    expirationDate?: Date |string 
}

type typeOfProduct = "fresh"|"processed"|"organic";