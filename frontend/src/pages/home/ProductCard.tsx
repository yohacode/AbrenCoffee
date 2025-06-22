import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
}

interface Props {
  product: Product;
  isLoading: boolean;
  onAddToCart: () => void;
  onView: () => void;
}

const ProductCard: React.FC<Props> = ({ product, isLoading, onAddToCart, onView }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name || "Product image"} />
      <h3>{product.name}</h3>
      <div className="product-details">
        <p className="price">${product.price.toFixed(2)}</p>
      </div>
      <button
        className="addCart"
        onClick={onAddToCart}
        disabled={isLoading || isOutOfStock}
        type="button"
      >
        {isLoading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </button>
      <button className="viewCart" onClick={onView} type="button">
        View Product
      </button>
    </article>
  );
};

export default ProductCard;
