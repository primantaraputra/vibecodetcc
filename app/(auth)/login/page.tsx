'use client';

import { WaveAuthCard, LoginForm } from '@/components/auth';

export default function LoginPage() {
  return (
    <WaveAuthCard
      title="Selamat Datang"
      subtitle="Masuk untuk melanjutkan ke sistem"
      backHref="/"
      mode="login"
    >
      <LoginForm />
    </WaveAuthCard>
  );
}
