import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ShippingForm.css';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const ShippingForm: React.FC<Props> = ({
    formData,
    onChange,
    onSubmit,
    loading,
    setFormData
  }) => {
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    const fetchShippingAddress = async () => {
      try {
        const response = await axios.get('/orders/shipping/retrieve/');
        if (response.status === 200 || response.status === 204) {
          const data = response.data;
          if (Object.keys(data).length > 0) {
            setFormData((prev) => ({ ...prev, ...data }));
            setPrefilled(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch shipping address', error);
      }
    };

    fetchShippingAddress();
  }, [setFormData]);

  return (
    <form onSubmit={onSubmit} className='shipping-form-container'>
      <h2 className='title'>
        {prefilled ? 'Edit Shipping Information' : 'Shipping Information'}
      </h2>
      <div className="form-input-group">
        {[
          'full_name', 'email', 'phone_number',
          'address1', 'address2', 'street',
          'city', 'state', 'country', 'zipcode'
        ].map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field.replace('_', ' ').toUpperCase()}
            value={formData[field] || ''}
            onChange={onChange}
            required={field !== 'address2'}
            className='input'
          />
        ))}
        <button
          type="submit"
          disabled={loading}
          className='button'
        >
          {loading ? 'Submitting...' : prefilled ? 'Update & Continue' : 'Continue to Review'}
        </button>
      </div>
      
    </form>
  );
};

export default ShippingForm;
