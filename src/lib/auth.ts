import { supabase } from './supabase';
import type { User } from '../types/user';
import { generateAccountNumber } from '../utils/account';
import { cryptoService } from '../services/cryptoService';

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  // Busca o usuário pelo email
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (userError || !userData) {
    throw { code: 'invalid_credentials' };
  }

  // Verifica a senha
  const isPasswordValid = await cryptoService.verifyPassword(
    password,
    userData.password
  );
  if (!isPasswordValid) {
    throw { code: 'invalid_credentials' };
  }

  // Busca o saldo
  const { data: balanceData, error: balanceError } = await supabase
    .from('saldo')
    .select('saldo')
    .eq('account', userData.account)
    .single();

  if (balanceError) {
    console.error('Error fetching balance:', balanceError);
    throw balanceError;
  }

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    balance: balanceData?.saldo || 0,
    avatar: userData.avatar_url,
    account: userData.account,
  };
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<void> {
  // Verifica se já existe um usuário com este email
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  // Gera o hash da senha
  const hashedPassword = await cryptoService.hashPassword(password);

  // Gera um número de conta único
  const account = generateAccountNumber();

  // Insere o novo usuário
  const { error: userError } = await supabase.from('users').insert([
    {
      name,
      email,
      password: hashedPassword,
      account,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        name
      )}`,
    },
  ]);

  if (userError) throw userError;

  // Cria o registro de saldo inicial
  const { error: balanceError } = await supabase.from('saldo').insert([
    {
      account,
      saldo: 0,
    },
  ]);

  if (balanceError) throw balanceError;
}

export async function updateUserProfile(
  userId: string,
  data: Partial<User>
): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
}
