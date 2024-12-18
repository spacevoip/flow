import React from 'react';
import PinChange from './PinChange';
import PasswordChange from './PasswordChange';

interface SecuritySectionProps {
  userId: string;
}

export default function SecuritySection({ userId }: SecuritySectionProps) {
  return (
    <div className="space-y-6">
      <PinChange />
      <div className="border-t border-gray-200 pt-6">
        <PasswordChange userId={userId} />
      </div>
    </div>
  );
}