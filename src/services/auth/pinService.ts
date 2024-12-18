import { supabase } from '../../lib/supabase';
import { cryptoService } from '../cryptoService';

export const pinService = {
  async verifyPinExists(account: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('auth')
        .eq('account', account)
        .single();

      if (error) throw error;
      return !!data?.auth;
    } catch (error) {
      console.error('Erro ao verificar PIN:', error);
      return false;
    }
  },

  async changePin(
    userId: string,
    currentPin: string,
    newPin: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Primeiro, verifica se o PIN atual está correto
      const { data: user } = await supabase
        .from('users')
        .select('auth')
        .eq('id', userId)
        .single();

      if (!user) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      const isPinValid = await cryptoService.verifyPassword(
        currentPin,
        user.auth
      );
      if (!isPinValid) {
        return { success: false, error: 'PIN atual incorreto' };
      }

      // Hash do novo PIN
      const hashedPin = await cryptoService.hashPassword(newPin);

      // Atualiza o PIN no banco de dados
      const { error: updateError } = await supabase
        .from('users')
        .update({ auth: hashedPin })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao alterar PIN:', error);
      return {
        success: false,
        error: 'Ocorreu um erro ao alterar o PIN. Tente novamente mais tarde.',
      };
    }
  },
};
