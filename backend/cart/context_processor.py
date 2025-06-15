from .cart import Cart

def cart(request):
    #return the default data from our cart
    return {'cart': Cart(request)}