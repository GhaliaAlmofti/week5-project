import React, { useEffect, useState, useMemo } from 'react';
import { Button, Spinner, Alert, Modal, Card, ModalHeader, ModalBody, TextInput } from 'flowbite-react'; 
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Product { 
  id: number; 
  title: string; 
  price: number; 
  stock: number; 
  thumbnail: string;
}

const BASE_URL = '/products';

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState(0); 
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${BASE_URL}?limit=0`); 
      setProducts(response.data.products);
      setTotalProducts(response.data.total);
    } catch (err) {
      setError('Failed to fetch products. Check the network connection or API URL.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []); 

  const handleDelete = async (id: number | null) => {
    if (!id) return;
    try {
      setProducts(prev => prev.filter(p => p.id !== id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return products.filter(product => 
      product.title.toLowerCase().includes(lowerCaseSearch) ||
      product.id.toString().includes(lowerCaseSearch)
    );
  }, [products, searchTerm]);
  
  if (loading && products.length === 0) {
    return <div className="text-center p-8"><Spinner size="xl" /></div>;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Products List ({totalProducts})</h2>
        
        <TextInput
          type="text"
          sizing="md"
          className="w-full md:w-80 rounded-lg shadow-sm"
          placeholder=" Search by title or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button onClick={() => navigate('/dashboard/products/add')} color="teal">
          Add New Product
        </Button>
      </div>

      {error && <Alert color="failure" onDismiss={() => setError(null)} className="mb-4">{error}</Alert>}
      
      <Card className="w-full">
        <div className="overflow-y-auto max-h-[70vh] p-2"> 
          
          {filteredProducts.length === 0 && !loading && (
            <p className="text-center text-gray-500 p-10">No products match your search criteria.</p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
           
                className="h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300" 
              >
                <div className="flex flex-col">
                
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="w-full h-48 object-cover rounded-t mb-4" 
                  />
             
                  <div className="px-2 pb-2">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 truncate" title={product.title}>
                      {product.title}
                    </h5>
                    <p className="text-sm text-gray-500 mb-3">ID: {product.id}</p>

                   
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
                
              
                <div className="flex justify-between gap-2 p-2 pt-0 mt-auto border-t border-gray-100">
                  <Button 
                    size="sm" 
                    color="teal" 
                    pill 
                    className="w-full"
                    onClick={() => navigate(`/dashboard/products/edit/${product.id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    color="red" 
                    pill 
                    className="w-full"
                    onClick={() => { setProductToDelete(product.id); setShowDeleteModal(true); }}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

  
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size="md">
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete product ID **{productToDelete}**?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(productToDelete)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ProductsList;