export default function ProductCard({ product, onAdd }) {
    return (
        <div className="card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>₹{product.price}</p>
            <div className="add-buy">
            <button onClick={() => onAdd(product)} id="btn" >Add to cart</button>
            <button onClick={() => onAdd(product)} id="btn" >Buy it now</button>
            </div>
        </div>
    );
}