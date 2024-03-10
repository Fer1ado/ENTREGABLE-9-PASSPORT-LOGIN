export default class Cart{
    constructor(productId, quantity){
        this.cartNumber = Cart.agregarId()
        this.products = []
    }

    static agregarId(){ 
        return(Math.trunc(Math.random()*(5000 - 1)+1))
    }
}
