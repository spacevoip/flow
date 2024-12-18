import React, { useState } from 'react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { pinService } from '../../../../services/auth/pinService';
import PinInput from '../../../pix/pin/PinInput';
import { toast } from 'react-hot-toast';

interface NewPinStepProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NewPinStep({ onSuccess, onCancel }: NewPinStepProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePinSuccess = async (newPin: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      await pinService.changePin(user.id, newPin);
      toast.success('PIN alterado com sucesso');
      onSuccess();
    } catch (error) {
      console.error('Erro ao alterar PIN:', error);
      toast.error('Falha ao alterar o PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinError = (message: string) => {
    toast.error(message);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-medium text-gray-900">Novo PIN</h4>
        <p className="text-sm text-gray-500">Digite seu novo PIN de 4 dígitos</p>
      </div>

      <PinInput
        onSuccess={handlePinSuccess}
        onError={handlePinError}
        isLoading={isLoading}
      />

      <button
        onClick={onCancel}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancelar
      </button>
    </div>
  );
}