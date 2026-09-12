import Link from 'next/link';

interface AuthFooterLinksProps {
  type: 'login' | 'register';
}

export function AuthFooterLinks({ type }: AuthFooterLinksProps) {
  return (
    <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
      {type === 'login' ? (
        <p>
          Belum memiliki akun warga?{' '}
          <Link href="/register" className="text-brand-600 font-semibold hover:underline">
            Daftar Akun Masyarakat
          </Link>
        </p>
      ) : (
        <p>
          Sudah memiliki akun?{' '}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            Masuk ke Sistem
          </Link>
        </p>
      )}
    </div>
  );
}
