import React, { useState } from 'react';
import { Button, Card, Label, TextInput, Alert, Spinner } from 'flowbite-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {

  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null; 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm">
        <Card className="w-full p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center text-[color:var(--primary)]">Admin Login</h2>
          {error && <Alert color="failure" onDismiss={() => setError(null)} className="mb-4">{error}</Alert>}
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username">Username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="e.g. kminchelle"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-2 focus:ring-blue-200"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              color="blue"
              className="w-full"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-3" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;