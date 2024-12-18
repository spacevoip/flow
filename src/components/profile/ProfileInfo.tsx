import React from 'react';
import UserInfoSection from './info/UserInfoSection';
import SecuritySection from './security/SecuritySection';
import type { User } from '../../types/user';

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="space-y-6">
      <UserInfoSection user={user} />
      <SecuritySection userId={user.id} />
    </div>
  );
}