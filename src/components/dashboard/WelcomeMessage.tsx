import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function WelcomeMessage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-900">
        Olá, {user?.name?.split(' ')[0]}!
      </h1>
      <p className="text-lg text-gray-600">
        Você está no Sistema Financeiro mais Seguro, Rápido e Prático do Brasil
      </p>
    </div>
  );
}