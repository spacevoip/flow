import React from 'react';
import PinInput from '../../../pix/pin/PinInput';
import { toast } from 'react-hot-toast';

interface PinVerificationStepProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PinVerificationStep({ onSuccess, onCancel }: PinVerificationStepProps) {
  const handlePinError = (message: string) => {
    toast.error(message);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-medium text-gray-900">Verificação de PIN</h4>
        <p className="text-sm text-gray-500">Digite seu PIN atual para continuar</p>
      </div>

      <PinInput
        onSuccess={onSuccess}
        onError={handlePinError}
      />

      <button
        onClick={onCancel}
        className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
      >
        Cancelar
      </button>
    </div>
  );
}