import { PyramidLogo } from '@/components/logo/PyramidLogo';
import { LoginCard } from '@/components/auth/LoginCard';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      {/* Logo at the top center */}
      <div className="mb-8">
        <PyramidLogo />
      </div>

      {/* Login card centered horizontally and vertically */}
      <LoginCard />
    </main>
  );
}