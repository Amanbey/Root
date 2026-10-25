'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Leaf, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Mountain, 
  Globe, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  WifiOff,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signUpAction } from '@/app/auth/actions';
import { registerOfflineFarmer } from '@/lib/offline/auth';
import { EthiopianRegion, AgroEcologicalZone, SupportedLanguage } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

const REGIONS: EthiopianRegion[] = [
  'Oromia',
  'Amhara',
  'Tigray',
  'Sidama',
  'Central Ethiopia',
  'South Ethiopia',
  'Somali',
  'Benishangul-Gumuz',
  'Afar',
];

const AGRO_ZONES: AgroEcologicalZone[] = ['Weyna Dega', 'Dega', 'Kolla', 'Bereha'];

export default function RegisterPage() {
  const router = useRouter();
  const { t, tRegion, tZone, language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState<EthiopianRegion>('Oromia');
  const [agroZone, setAgroZone] = useState<AgroEcologicalZone>('Weyna Dega');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(
    language || 'en'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Monitor network online / offline changes reactively
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setPreferredLanguage(newLang);
    setLanguage(newLang);
  };

  // Offline Registration Routine
  const handleOfflineRegistration = async () => {
    try {
      await registerOfflineFarmer({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        region,
        agroZone,
        preferredLanguage,
      });

      setErrorMessage(null);
      setSuccessMessage(t('auth_offline_reg_success'));
      setTimeout(() => {
        router.push('/profile');
      }, 700);
      return true;
    } catch (saveErr) {
      console.warn('[Register] Offline registration error:', saveErr);
      setErrorMessage('Failed to save offline profile locally. Please check your storage.');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Form validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Full name is required (at least 2 characters)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    // If client is already offline, register completely locally
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOfflineRegistration();
      return;
    }

    // If online, perform Supabase server action with graceful offline fallback
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('password', password);
    formData.append('region', region);
    formData.append('agroZone', agroZone);
    formData.append('preferredLanguage', preferredLanguage);

    startTransition(async () => {
      try {
        const result = await signUpAction(null, formData);
        if (result && !result.success) {
          setErrorMessage(result.error || 'Registration failed. Please check your details.');
        } else if (result?.redirectTo) {
          router.push(result.redirectTo);
        }
      } catch (networkError) {
        // Network fetch threw (offline / disconnected in field)
        console.warn('[Register] Network call failed, activating offline registration:', networkError);
        setIsOffline(true);
        await handleOfflineRegistration();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 flex flex-col justify-center items-center p-4 py-8 relative">
      {/* Top Bar with Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Top Brand Logo */}
      <div className="mb-6 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/40">
            <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <h1 className="font-black text-2xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              {t('brand_name')}
            </h1>
            <p className="text-[11px] text-slate-400 -mt-1 font-medium">
              {t('auth_register_title')}
            </p>
          </div>
        </Link>
      </div>

      <Card className="w-full max-w-lg bg-slate-900/80 border border-slate-800 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] shadow-2xl backdrop-blur-md transition-all duration-300">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-xl font-bold text-white">
            {t('auth_register_header_title')}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {t('auth_register_header_sub')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Offline Mode Active Banner */}
          {isOffline && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-1 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <WifiOff className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{t('auth_offline_badge')}</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                {t('auth_offline_notice')}
              </p>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  {t('auth_field_fullname')}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="e.g. Almaz Tadesse"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {t('auth_field_phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+251 91 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  {t('auth_email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  {t('auth_password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Region & Agro-Ecological Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="region" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {t('prof_region')}
                </Label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as EthiopianRegion)}
                  className="w-full h-10 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {tRegion(r)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="agroZone" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                  {t('prof_agro_zone')}
                </Label>
                <select
                  id="agroZone"
                  value={agroZone}
                  onChange={(e) => setAgroZone(e.target.value as AgroEcologicalZone)}
                  className="w-full h-10 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  {AGRO_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {tZone(z)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <Label htmlFor="preferredLanguage" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                {t('auth_field_preferred_language')}
              </Label>
              <select
                id="preferredLanguage"
                value={preferredLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="w-full h-10 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="om">Afaan Oromoo</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full min-h-[44px] h-11 sm:h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold border border-emerald-400/40 hover:border-emerald-300 shadow-lg shadow-emerald-950/50 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.45)] hover:ring-1 hover:ring-emerald-400/50 flex items-center justify-center gap-2 mt-2 touch-manipulation hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('auth_btn_registering')}</span>
                </>
              ) : (
                <>
                  <span>{t('auth_btn_complete_registration')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-xs text-slate-400 pt-0">
          <p>
            {t('auth_has_account')}{' '}
            <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
              {t('auth_sign_in_here')}
            </Link>
          </p>
          <Link href="/" className="text-slate-500 hover:text-slate-300 text-[11px] pt-1">
            ← {t('auth_return_home')}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
