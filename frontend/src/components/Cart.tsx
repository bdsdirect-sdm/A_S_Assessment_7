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

const Cart: React.FC = () => {
  const navigate = useNavigate();


  const incItem = async(cartId:any, productId:any, quantity:any) => {
    await api.put(`cart/${cartId}`, {quantity: quantity + 1, productId: productId});
    queryClient.invalidateQueries({
      queryKey: ['cart']
    });
  }

  const decItem = async(cartId:any, productId:any, quantity:any) => {
    if(quantity >= 2){
      await api.put(`cart/${cartId}`, {quantity: quantity - 1, productId: productId});
      queryClient.invalidateQueries({
        queryKey: ['cart']
      });
    }
    else{
      delItem(cartId);
    }
  }

  const delItem = (cartId: any) => {
    console.log("Deleting cart item with ID:", cartId); // Check if the cartId is correct
    api.delete(`cart/${cartId}`).then(() => {
      // Once deleted, invalidate the cache to update the UI
      queryClient.invalidateQueries({
        queryKey: ['cart']
      });
    }).catch((error) => {
      console.error("Error deleting item from cart:", error);
    });
  }

  const { data: cart, isLoading: cartLoading, isError: cartError, error: cartErrorData } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart
  });


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: usefetchProducts
  });

  if (cartLoading || isLoading) {
    return <h1>Loading...</h1>;
  }

  if (cartError || isError) {
    return <h1>{error?.message || cartErrorData?.message}</h1>;
  }

  const cartProductIds = cart?.data.map((item: any) => item.productId);

  const productsInCart = data?.data.filter((product: any) =>
    cartProductIds.includes(product.id)
  );

  console.log(productsInCart); // These are the products in the cart

  return (
    <div className="cart-container">

      <button className='float-start' onClick={()=>{
        navigate('/')
      }} >Back</button>
      <h1>Your Cart</h1>
      <br /><br />
      {cart?.data.length === 0 || productsInCart?.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr className='table-secondary' >
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
              {/* <th>Remove</th> */}
            </tr>
          </thead>
          <tbody>
            {cart?.data.map((cartItem: any) => {
              const product = productsInCart?.find((product: any) => product.id === cartItem.productId);

              return (
                <tr key={cartItem.id}>
                  <td>{product?.name}</td>
                  <td>img</td>
                  <td>${product?.price}</td>
                  <td>{cartItem.quantity} units</td>
                  <td>${product?.price * cartItem.quantity}</td>
                  <td colSpan={3}  className='d-flex'>
                    <button className='btn btn-outline-dark px-3' onClick={()=>{
                      decItem(cartItem.id, product.id, cartItem.quantity);
                    }} >-</button>
                    <p className='mx-3' ></p>
                    <button className='btn btn-outline-dark px-3' onClick={()=>{
                      incItem(cartItem.id, product.id, cartItem.quantity);
                    }}>+</button>
                  </td>
                  {/* <td>
                    <button className='btn btn-outline-danger'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <br />
      <button type="button" onClick={()=>{
        navigate('/checkout')
      }}>CheckOut</button>
    </div>
  );
}

export default Cart;
