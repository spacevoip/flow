import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { pinService } from '../../../services/auth/pinService';
import PinInput from '../../pix/pin/PinInput';
import { toast } from 'react-hot-toast';

export default function PinChange() {
  const { user } = useAuthStore();
  const [step, setStep] = useState<'initial' | 'verify' | 'new'>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPinConfigured, setHasPinConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPinStatus = async () => {
      if (user?.account) {
        const hasPin = await pinService.verifyPinExists(user.account);
        setHasPinConfigured(hasPin);
      }
    };
    checkPinStatus();
  }, [user?.account]);

  const handleVerificationSuccess = () => {
    setStep('new');
  };

  const handleNewPinSuccess = async (newPin: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      await pinService.changePin(user.id, newPin);
      toast.success(hasPinConfigured ? 'PIN alterado com sucesso' : 'PIN cadastrado com sucesso');
      setStep('initial');
      setHasPinConfigured(true);
    } catch (error) {
      console.error('Erro ao alterar PIN:', error);
      toast.error(hasPinConfigured ? 'Falha ao alterar o PIN' : 'Falha ao cadastrar o PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinError = (message: string) => {
    toast.error(message);
  };

  if (hasPinConfigured === null) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lock className="text-blue-600" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {hasPinConfigured ? 'Alterar PIN' : 'Cadastrar PIN'}
          </h3>
          <p className="text-sm text-gray-500">
            {hasPinConfigured 
              ? 'Atualize seu PIN de segurança'
              : 'Configure seu PIN de segurança para realizar transações'}
          </p>
        </div>
      </div>

      {step === 'initial' && (
        <button
          onClick={() => setStep(hasPinConfigured ? 'verify' : 'new')}
          className="w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
        >
          {hasPinConfigured ? 'Alterar PIN' : 'Cadastrar PIN'}
        </button>
      )}

      {step === 'verify' && hasPinConfigured && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900">Verificação de PIN</h4>
            <p className="text-sm text-gray-500">Digite seu PIN atual para continuar</p>
          </div>

          <PinInput
            onSuccess={handleVerificationSuccess}
            onError={handlePinError}
          />

          <button
            onClick={() => setStep('initial')}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {step === 'new' && (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900">
              {hasPinConfigured ? 'Novo PIN' : 'Cadastrar PIN'}
            </h4>
            <p className="text-sm text-gray-500">Digite {hasPinConfigured ? 'seu novo' : 'um'} PIN de 4 dígitos</p>
          </div>

          <PinInput
            onSuccess={handleNewPinSuccess}
            onError={handlePinError}
            isLoading={isLoading}
          />

          <button
            onClick={() => setStep('initial')}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}