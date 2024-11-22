import { useQuery } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import api from '../api/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { queryClient } from '../main';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const getCart = () => {
  return api.get("cart?_expand=product");
}

const Checkout:React.FC = () => {
  const navigate = useNavigate();

  const checkoutValidation = Yup.object().shape({
    email: Yup.string().required('email is required'),
    address: Yup.string().required("Address is required"),
    cardnumber: Yup.number().required("card number is required").min(16,"Invalid card number"),
    exp: Yup.date().min(new Date(), "Don't select past date").required("Exp date is required"),
    cvv: Yup.number().required("cvv is required").min(3,"cvv is invalid")
  })

  const { data: cart, isLoading: cartLoading, isError: cartError, error: cartErrorData } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart
  });

  const onCheckout = async(values:any) => {
    try{
      await axios.post("http://localhost:3000/checkout", {email: values.email});
      toast.success("Checkout successful");
      navigate('/');
      return
    }
    catch(err:any){
      toast.error(err.response.data.message)
    }
  }

  if(cart?.data.length == 0){
    navigate('/');
  }

  if(cartLoading){
    return <div>Loading...</div>
  }

  if(cartError){
    return <div>Error: {cartErrorData.message}</div>
  }


  
  return (
    <>
    <Formik
    initialValues={{
      email: '',
      address: '',
      cardnumber: '',
      exp: '',
      cvv: ''
      }}
      validationSchema={checkoutValidation}
      onSubmit={onCheckout}
    >
      {()=>(
        <>
        <button className=' ' onClick={()=>{
        navigate('/cart')
      }} >Back</button>
      <br /><br /><br />
        <Form>
      
          <div className="checkout-form">
            <div className="checkout-form-group">
              <label>Email:</label>
              <Field type="email" name="email" className="form-control border border-1 border-dark" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="checkout-form-group">
              <label>Address:</label>
              <Field type="text" name="address" className="form-control border border-1 border-dark" placeholder="Address" />
              <ErrorMessage name="address" component="div" className="text-danger" />
            </div>

            <br /><br /><br />
            <div className="checkout-form-group">
              <label>Card Number:</label>
              <Field type="text" name="cardnumber" className="form-control border border-1 border-dark" minLength={16} maxLength={16} placeholder="Card Number" />
              <ErrorMessage name="cardnumber" component="div" className="text-danger" />
            </div>
            <br /><br />
            <div className='d-flex' >
              <div className="checkout-form-group">
                <label>Expiration Date:</label>
                <Field type="month" name="exp" className="form-control border border-1 border-dark" placeholder="Expiration Date" />
                <ErrorMessage name="exp" component="div" className="text-danger" />
              </div>
              <div className="checkout-form-group ms-5">
                <label>CVV:</label>
                <Field type="text" name="cvv" className="form-control border border-1 border-dark" maxLength={3} placeholder="CVV" />
                <ErrorMessage name="cvv" component="div" className="text-danger" />
              </div>
            </div>
            <br /><br />
            <button type="submit">Submit</button>
          </div>
        </Form>
        </>
      )}
    </Formik>
    </>
  )
}

export default Checkout