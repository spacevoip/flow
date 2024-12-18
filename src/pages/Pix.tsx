import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useFavorites } from '../hooks/useFavorites';
import PixForm from '../components/pix/form/PixForm';
import PixReviewCard from '../components/pix/form/PixReviewCard';
import FavoritesCard from '../components/pix/favorites/FavoritesCard';
import AddFavoriteForm from '../components/pix/favorites/AddFavoriteForm';
import { validateAmount } from '../utils/validation';
import { useLocale } from '../hooks/useLocale';
import { calculateTax } from '../utils/currency';
import { hasEnoughBalance } from '../services/balanceService';
import { sendPix } from '../services/pixService';
import type { Favorite } from '../types/favorite';

export default function Pix() {
  const { t } = useLocale();
  const { user } = useAuthStore();
  const { favorites, refresh: refreshFavorites } = useFavorites(user?.account);

  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [showAddFavorite, setShowAddFavorite] = useState(false);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      toast.error(t('common.error.notAuthenticated'));
      return;
    }

    const amountValue = parseFloat(amount);
    const amountError = validateAmount(amountValue);
    if (amountError) {
      setError(amountError);
      return;
    }

    // Calcula o valor total com a taxa
    const tax = calculateTax(amountValue);
    const totalAmount = amountValue + tax;

    // Verifica se tem saldo suficiente
    try {
      const hasBalance = await hasEnoughBalance(user.account, totalAmount);
      if (!hasBalance) {
        setError('Saldo insuficiente para realizar esta transferência');
        return;
      }
      setShowReview(true);
    } catch (error) {
      setError('Erro ao verificar saldo. Tente novamente.');
      return;
    }
  };

  const handleTransactionSuccess = async () => {
    try {
      if (!user?.account) {
        throw new Error('Usuário não autenticado');
      }
      // Enviando apenas o valor da transação, sem a taxa
      const transactionAmount = parseFloat(amount);
      await sendPix(pixKey, transactionAmount, user.account);
      toast.success('PIX enviado com sucesso!');
      // Reset form
      setPixKey('');
      setAmount('');
      setFormattedAmount('');
      setDescription('');
      setShowReview(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar PIX';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowReview(false);
    setError('');
  };

  const handleSelectFavorite = (favorite: Favorite) => {
    setPixKey(favorite.key);
  };

  const handleFavoriteAdded = () => {
    setShowAddFavorite(false);
    refreshFavorites();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {!showReview ? (
            <PixForm
              pixKey={pixKey}
              setPixKey={setPixKey}
              amount={amount}
              formattedAmount={formattedAmount}
              setAmount={setAmount}
              setFormattedAmount={setFormattedAmount}
              description={description}
              setDescription={setDescription}
              error={error}
              onSubmit={handleInitialSubmit}
            />
          ) : (
            <PixReviewCard
              pixKey={pixKey}
              amount={parseFloat(amount)}
              description={description}
              onConfirm={handleTransactionSuccess}
              onCancel={handleCancel}
            />
          )}
        </div>

        <div>
          {showAddFavorite ? (
            <AddFavoriteForm
              onSuccess={handleFavoriteAdded}
              onCancel={() => setShowAddFavorite(false)}
            />
          ) : (
            <FavoritesCard
              favorites={favorites}
              onSelect={handleSelectFavorite}
              onFavoriteAdded={refreshFavorites}
              onShowAddForm={() => setShowAddFavorite(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}