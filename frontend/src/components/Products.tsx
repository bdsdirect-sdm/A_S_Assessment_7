import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '../main';

const usefetchProducts = () => {
    return api.get("products");
}

const getCart = () => {
    return api.get("cart?_expand=product");
}

const Products: React.FC = () => {
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['products'],
        queryFn: usefetchProducts
    });

    const { data: cart, isLoading: cartLoading, isError: cartError, error: cartErrorData } = useQuery({
        queryKey: ['cart'],
        queryFn: getCart
    });

    const addtoCart = async (productId: any, quantity: any) => {
        try {
            const response = await api.post('cart', {
                productId: productId,
                quantity: quantity
            });
            queryClient.invalidateQueries({
                queryKey: ['cart']
            });
            return response;
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading || cartLoading) {
        return (
            <h1>Loading...</h1>
        );
    }

    if (isError || cartError) {
        return (
            <h1>{error?.message || cartErrorData?.message}</h1>
        );
    }

    const cartProductIds = cart?.data.map((item: any) => item.productId);

    return (
        <div className="container">
            <button 
                type="button" 
                className="btn btn-primary my-3"
                onClick={() => navigate('/cart')}
            >
                Go to Cart
            </button>
            <div className="row">
                {data?.data.map((product: any, index: number) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="card">
                            <img 
                                src="https://via.placeholder.com/150" 
                                className="card-img-top" 
                                alt={product.name} 
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">
                                    <strong>Price:</strong> ${product.price}<br />
                                    <strong>Category:</strong> {product.category}<br />
                                    <strong>Stock:</strong> {product.stock} units<br />
                                    <strong>Rating:</strong> {product.rating}<br />
                                    <strong>Seller:</strong> {product.seller}<br />
                                    <strong>Description:</strong> {product.description}
                                </p>
                                {cartProductIds.includes(product.id) ? (
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-dark"
                                        onClick={() => navigate("/cart")}
                                    >
                                        Go to Cart
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
                                        onClick={() => addtoCart(product.id, 1)}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
