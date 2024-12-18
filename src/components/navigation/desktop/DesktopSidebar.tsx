import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { navigationItems } from '../config/navigationItems';
import LogoutButton from '../common/LogoutButton';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import { formatCurrency } from '../../../utils/currency';

export default function DesktopSidebar() {
  const { user } = useAuthStore();
  const [showBalance, setShowBalance] = useState(false);

  return (
    <div className="w-full h-full bg-white shadow-lg flex flex-col">
      {/* Profile Section */}
      <div className="p-6 border-b flex flex-col items-center text-center">
        <div className="mb-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold text-gray-900">{user?.name}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Account Info */}
        <div className="mt-4 w-full space-y-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-sm text-gray-600">Conta</p>
            <p className="font-mono font-medium text-blue-600 break-all">
              {user?.account}
            </p>
          </div>

          {/* Balance Display */}
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Wallet size={16} className="text-blue-600" />
                <p className="text-sm text-blue-600">Saldo Disponível</p>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}
              >
                {showBalance ? (
                  <EyeOff size={16} className="text-blue-600" />
                ) : (
                  <Eye size={16} className="text-blue-600" />
                )}
              </button>
            </div>
            <p className="font-mono font-medium text-blue-700">
              {showBalance ? formatCurrency(user?.balance || 0) : '••••••'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <LogoutButton />
    </div>
  );
}