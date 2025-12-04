import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Card, Label, TextInput, Textarea, Alert, Spinner } from 'flowbite-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

interface ProductForm { 
  title: string; 
  description: string; 
  price: number | ''; 
  stock: number | ''; 
  thumbnail: string;
}

const ProductAddEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ProductForm>({
    title: '', description: '', price: '', stock: '', thumbnail: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  const fetchProductData = useCallback(async (productId: string) => {
    setFetchLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products/${productId}`);
      const product = response.data;
      setFormData({
        title: product.title, 
        description: product.description, 
        price: product.price, 
        stock: product.stock,
        thumbnail: product.thumbnail || (product.images && product.images[0]) || '',
      });
    } catch (err) {
      setError('Failed to load product data.');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEditMode && id) { fetchProductData(id); }
  }, [isEditMode, id, fetchProductData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' || id === 'stock' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string | null;
      if (result) setFormData(prev => ({ ...prev, thumbnail: result }));
    };
    reader.readAsDataURL(file);
  };


  const isFormValid = useMemo(() => {
    return (
      formData.title.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.price !== '' && 
      formData.stock !== '' && 
      Number(formData.price) > 0 &&
      Number(formData.stock) >= 0
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || loading) return; 

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        thumbnail: formData.thumbnail,
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products/add', payload); 
      }
      
      navigate('/dashboard/products');
      
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'add'} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return <div className="text-center p-8"><Spinner size="xl" /></div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-full">
   
      <Card className="w-full max-w-xl p-6 shadow-lg"> 
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
          {isEditMode ? `Edit Product (ID: ${id})` : 'Add New Product'}
        </h2>
        
        {error && <Alert color="failure" onDismiss={() => setError(null)} className="mb-4">{error}</Alert>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
     
          <div>
            <Label htmlFor="title">Product Title</Label>
            <TextInput id="title" type="text" required value={formData.title} onChange={handleChange} className="shadow-sm" />
          </div>
       
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" required value={formData.description} onChange={handleChange} rows={4} className="shadow-sm" />
          </div>

       
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="thumbnail">Product Image (URL or upload)</Label>
            <TextInput id="thumbnail" type="text" placeholder="Paste image URL or upload below" value={formData.thumbnail} onChange={handleChange} className="shadow-sm" />
            <input id="file" name="file" type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
            {formData.thumbnail && (
              <div className="mt-2">
                <Label>Preview</Label>
                <img src={formData.thumbnail} alt="preview" className="w-32 h-32 object-cover rounded mt-1" />
              </div>
            )}
          </div>
          
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <TextInput id="price" type="number" step="0.01" required value={formData.price} onChange={handleChange} className="shadow-sm" />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <TextInput id="stock" type="number" required value={formData.stock} onChange={handleChange} className="shadow-sm" />
            </div>
          </div>
          
         
          <Button 
            type="submit" 
            disabled={loading || !isFormValid} 
    
            color={isFormValid ? 'teal' : 'gray'}
            className="mt-4"
          >
            {loading ? (
              <Spinner size="sm" light={true} className="mr-2" />
            ) : (
              isEditMode ? 'Update Product' : 'Add Product'
            )}
          </Button>
        </form>
      </Card>

   
      <Button 
        color="light" 
        onClick={() => navigate('/dashboard/products')} 
        className="mt-4 w-full max-w-xl"
      >
        Back to Product List
      </Button>
    </div>
  );
};

export default ProductAddEdit;