import React, { useState, useMemo } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { sendPix } from '../../../services/pixService';
import { formatCurrency, calculateTax } from '../../../utils/currency';
import { toast } from 'react-hot-toast';

interface ReviewCardProps {
  pixKey: string;
  amount: number;
  description: string;
  onCancel: () => void;
}

export default function ReviewCard({
  pixKey,
  amount,
  description,
  onCancel
}: ReviewCardProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const tax = useMemo(() => calculateTax(amount), [amount]);
  const total = useMemo(() => amount + tax, [amount, tax]);

  const handleConfirm = async () => {
    if (!user?.account) return;
    
    setIsLoading(true);
    setError('');

    try {
      await sendPix(pixKey, amount, user.account);
      toast.success('PIX enviado com sucesso!');
      onCancel(); // Close review card
    } catch (error: any) {
      console.error('PIX transfer error:', error);
      setError(error.message || 'Falha ao enviar PIX');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Revisar PIX</h2>
        <p className="text-sm text-gray-500">Confirme os dados da transferência</p>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Chave PIX</span>
            <span className="font-medium text-gray-900">{pixKey}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor da Transferência</span>
            <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Taxa de Serviço</span>
            <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-800 font-medium">Valor Total</span>
              <span className="font-semibold text-lg text-gray-900">{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {amount <= 25 
                ? 'Taxa fixa de R$ 0,50 para transferências até R$ 25,00'
                : 'Taxa de 2.8% sobre o valor da transferência'}
            </p>
          </div>

          {description && (
            <div className="flex justify-between items-center pt-3">
              <span className="text-gray-600">Descrição</span>
              <span className="font-medium text-gray-900">{description}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
              isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            <span>Confirmar</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}