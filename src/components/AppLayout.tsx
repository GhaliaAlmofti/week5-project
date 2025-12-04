import React, { useState } from 'react';
import { 
  Sidebar, Navbar, Dropdown, 
  SidebarItems, SidebarItemGroup, SidebarItem,
  DropdownItem, DropdownHeader 
} from 'flowbite-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activePath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className="hidden md:block w-full md:w-64 md:h-screen">
        <div className="flex items-center p-2.5 mt-2 mb-5 rounded-lg">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white">
            Admin Dashboard
          </span>
        </div>
        
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem
              onClick={() => handleNavigation('/dashboard')}
              active={activePath === '/dashboard'}
              className="cursor-pointer px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              Dashboard
            </SidebarItem>
            
            <SidebarItem
              onClick={() => handleNavigation('/dashboard/products')}
              active={activePath.startsWith('/dashboard/products')}
              className="cursor-pointer px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              Products CRUD
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/40" 
            onClick={() => setMobileOpen(false)} 
          />
          
          <div className="relative w-64 h-full bg-white dark:bg-gray-800 shadow-xl">
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Admin Dashboard
              </div>
              <button 
                aria-label="Close menu" 
                onClick={() => setMobileOpen(false)} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Sidebar>
              <SidebarItems>
                <SidebarItemGroup>
                  <SidebarItem
                    onClick={() => handleNavigation('/dashboard')}
                    active={activePath === '/dashboard'}
                    className="cursor-pointer"
                  >
                    Dashboard
                  </SidebarItem>
                  
                  <SidebarItem
                    onClick={() => handleNavigation('/dashboard/products')}
                    active={activePath.startsWith('/dashboard/products')}
                    className="cursor-pointer"
                  >
                    Products CRUD
                  </SidebarItem>
                </SidebarItemGroup>
              </SidebarItems>
            </Sidebar>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-y-auto">
        <Navbar fluid className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex w-full items-center justify-between">
            <div className="md:hidden">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    {user?.firstName} {user?.lastName}
                  </span>
                }
              >
                <DropdownHeader>
                  <span className="block text-sm font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </span>
                </DropdownHeader>
                <DropdownItem onClick={handleLogout}>
                  Sign out
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </Navbar>

        <main className="p-4 md:p-6 flex-1 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;