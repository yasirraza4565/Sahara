import React, { useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/api";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  console.log("Cart contents:", cart);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    street: "",
    landmark: "",
    pincode: "",
    roadName: "",
    paymentMethod: "cash_on_delivery",
  });
  const [errors, setErrors] = useState({});

  // --- Purchase Protection Check ---
  const authToken = localStorage.getItem("authToken");

  // If cart is empty
  if (!cart || cart.length === 0) {
    return <p>Your cart is empty. Please add items before checking out.</p>;
  }

  // Block access if not authenticated
  if (!authToken) {
    return (
      <div className="checkout-access-denied text-center my-5">
        <h2>Access Denied</h2>
        <p>
          Please <strong>log in</strong> or <strong>sign up</strong> to complete your purchase.
        </p>
        <Link to="/auth" className="btn btn-primary mt-3">
          Go to Login / Sign Up
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validate = () => {
    let validationErrors = {};

    if (!form.fullName.trim()) {
      validationErrors.fullName = "Full Name is required";
    }
    if (!form.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      validationErrors.email = "Email is invalid";
    }

    if (!form.street.trim()) {
      validationErrors.street = "Street Address is required";
    }
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) {
      validationErrors.pincode = "Valid 6-digit Pincode is required";
    }

    if (!form.paymentMethod) {
      validationErrors.paymentMethod = "Payment method must be selected";
    }

    return validationErrors;
  };

  const calculateTotal = () => {
    return cart.reduce((s, i) => s + i.price * i.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const orderData = {
        customer: {
          fullName: form.fullName,
          email: form.email,
        },
        shippingAddress: {
          street: form.street,
          landmark: form.landmark,
          pincode: form.pincode,
          roadName: form.roadName,
        },
        paymentMethod: form.paymentMethod,
        items: cart,
        totalAmount: calculateTotal(),
      };

      try {
        const response = await axios.post(`${BACKEND_URL}/orders`, orderData);

        // --- SUCCESS HANDLING (REMOVED POPUP) ---
        console.log("Server Response:", response.data);

        clearCart();

        // Redirect to Confirmation page and pass success state
        navigate("/order-confirmation", {
          state: {
            orderId: response.data?.orderId,
            message: 'Order placed successfully!',
            type: 'success'
          },
        });
        // --- END SUCCESS HANDLING ---

      } catch (error) {
        const responseData = error.response?.data;
        const errorMessage = responseData?.message || error.message;
        const validationDetails = responseData?.errors;

        console.error("Order placement failed:", responseData || error.message);

        // Display validation failure via alert (as fallback for critical errors)
        if (validationDetails && validationDetails.length) {
          const failureMessage = validationDetails
            .map(
              (err) =>
                err.message
                  ? `Product ID ${err.id ?? "?"}: ${err.message}`
                  : `Product ID ${err.id ?? "?"}: issue`
            )
            .join("\n");

          alert(`❌ Order Validation Failed:\n${failureMessage}`);
        } else {
          alert(`❌ Order failed due to a server error: ${errorMessage}`);
        }
      }
    }
  };

  return (
    <div className="checkout-page container my-5">
      <h2>Checkout Details</h2>
      <form className="checkout-form row g-4" onSubmit={handleSubmit}>
        <div className="col-12">
          <h5 className="mb-3">Contact Information</h5>

          <div className="form-group mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-control"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-danger small">{errors.fullName}</p>
            )}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-danger small">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="col-12">
          <h5 className="mb-3">Shipping Address</h5>

          <div className="form-group mb-3">
            <label htmlFor="street" className="form-label">
              Street Address (House No./Building)
            </label>
            <input
              id="street"
              name="street"
              type="text"
              className="form-control"
              value={form.street}
              onChange={handleChange}
              placeholder="Enter your street"
            />
            {errors.street && (
              <p className="text-danger small">{errors.street}</p>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 form-group mb-3">
              <label htmlFor="landmark" className="form-label">
                Landmark (Optional)
              </label>
              <input
                id="landmark"
                name="landmark"
                type="text"
                className="form-control"
                value={form.landmark}
                onChange={handleChange}
                placeholder="Enter your landmark"
              />
            </div>

            <div className="col-md-6 form-group mb-3">
              <label htmlFor="roadName" className="form-label">
                Road Name (Optional)
              </label>
              <input
                id="roadName"
                name="roadName"
                type="text"
                className="form-control"
                value={form.roadName}
                onChange={handleChange}
                placeholder="Enter your road"
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="pincode" className="form-label">
              Pincode
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              className="form-control"
              value={form.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
              maxLength="6"
            />
            {errors.pincode && (
              <p className="text-danger small">{errors.pincode}</p>
            )}
          </div>
        </div>

        <div className="col-12">
          <h5 className="mb-3">Payment Method</h5>

          <div className="form-check">
            <input
              id="cod"
              name="paymentMethod"
              type="radio"
              className="form-check-input"
              value="cash_on_delivery"
              checked={form.paymentMethod === "cash_on_delivery"}
              onChange={handleChange}
            />
            <label htmlFor="cod" className="form-check-label">
              Cash on Delivery (COD)
            </label>
          </div>

          <div className="form-check">
            <input
              id="upi"
              name="paymentMethod"
              type="radio"
              className="form-check-input"
              value="upi"
              checked={form.paymentMethod === "upi"}
              onChange={handleChange}
            />
            <label htmlFor="upi" className="form-check-label">
              UPI / Google Pay / PhonePe
            </label>
          </div>

          <div className="form-check mb-3">
            <input
              id="netbanking"
              name="paymentMethod"
              type="radio"
              className="form-check-input"
              value="netbanking"
              checked={form.paymentMethod === "netbanking"}
              onChange={handleChange}
            />
            <label htmlFor="netbanking" className="form-check-label">
              Netbanking
            </label>
          </div>

          {errors.paymentMethod && (
            <p className="text-danger small">{errors.paymentMethod}</p>
          )}
        </div>

        <div className="col-12 mt-4 text-center">
          <h4>Total: ${calculateTotal().toFixed(2)}</h4>
          <button
            type="submit"
            className="place-order-btn btn btn-primary btn-lg w-100"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;