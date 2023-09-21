import Link from 'next/link';
import React from 'react';

const LoginButton = () => {
  return (
    <Link href="/login" className="btn group">
      <span className="btnShaddow" />
      <span className="relative">Login</span>
    </Link>
  );
};

export default LoginButton;
