'use client';

import { WaveAuthCard, RegisterForm } from '@/components/auth';

export default function RegisterPage() {
  return (
    <WaveAuthCard
      title="Daftar Akun Baru"
      subtitle="Lengkapi data diri Anda untuk pendaftaran akun warga"
      backHref="/login"
      mode="register"
    >
      <RegisterForm />
    </WaveAuthCard>
  );
}
