'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { getActiveOfflineFarmerSync, setOfflineAuthCookies } from '@/lib/offline/auth';
import { 
  User, 
  Phone, 
  MapPin, 
  Mountain, 
  Globe, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Sprout, 
  Compass,
  Camera,
  Upload,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FarmerProfile, EthiopianRegion, AgroEcologicalZone, SupportedLanguage, EthiopianCrop } from '@/lib/types';
import { updateFarmerProfileAction, updateAvatarAction, changePasswordAction } from '@/app/auth/actions';
import { useLanguage } from '@/lib/i18n/language-context';

interface ProfileFormProps {
  initialProfile: FarmerProfile | null;
  onAvatarChange?: (url: string | null) => void;
}

const ALL_ETHIOPIAN_CROPS_KEYS: Array<{ name: EthiopianCrop; icon: string }> = [
  { name: 'Teff', icon: '🌱' },
  { name: 'Wheat', icon: '🌾' },
  { name: 'Maize', icon: '🌽' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Barley', icon: '🌾' },
  { name: 'Enset', icon: '🌿' },
  { name: 'Faba Bean', icon: '🫘' },
  { name: 'Chickpea', icon: '🌱' },
  { name: 'Potato', icon: '🥔' },
  { name: 'Tomato', icon: '🍅' },
  { name: 'Onion', icon: '🧅' },
  { name: 'Sorghum', icon: '🌾' },
];

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

const ZONES: AgroEcologicalZone[] = [
  'Weyna Dega',
  'Dega',
  'Kolla',
  'Bereha',
];

export function ProfileForm({ initialProfile, onAvatarChange }: ProfileFormProps) {
  const { t, tCrop, tZone, tRegion, setLanguage: setGlobalLanguage } = useLanguage();

  // Profile Fields
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [phone, setPhone] = useState(initialProfile?.phone || '');
  const [region, setRegion] = useState<EthiopianRegion>(initialProfile?.region || 'Oromia');
  const [zoneName, setZoneName] = useState(initialProfile?.zone_name || '');
  const [woreda, setWoreda] = useState(initialProfile?.woreda || '');
  const [agroZone, setAgroZone] = useState<AgroEcologicalZone>(
    initialProfile?.agro_ecological_zone || 'Weyna Dega'
  );
  const [selectedCrops, setSelectedCrops] = useState<EthiopianCrop[]>(
    initialProfile?.main_crops || []
  );
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(
    initialProfile?.preferred_language || 'en'
  );
  const [farmSize, setFarmSize] = useState<number | undefined>(
    initialProfile?.farm_size_hectares || undefined
  );

  // Avatar State
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialProfile?.avatar_url || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialProfile was not provided from server, load from local offline storage
  useEffect(() => {
    if (!initialProfile) {
      const localFarmer = getActiveOfflineFarmerSync();
      if (localFarmer) {
        if (localFarmer.full_name) setFullName(localFarmer.full_name);
        if (localFarmer.phone) setPhone(localFarmer.phone);
        if (localFarmer.region) setRegion(localFarmer.region);
        if (localFarmer.zone_name) setZoneName(localFarmer.zone_name);
        if (localFarmer.woreda) setWoreda(localFarmer.woreda);
        if (localFarmer.agro_ecological_zone) setAgroZone(localFarmer.agro_ecological_zone);
        if (localFarmer.main_crops?.length) setSelectedCrops(localFarmer.main_crops);
        if (localFarmer.preferred_language) setPreferredLanguage(localFarmer.preferred_language);
        if (localFarmer.farm_size_hectares) setFarmSize(localFarmer.farm_size_hectares);
        if (localFarmer.avatar_url) {
          setAvatarUrl(localFarmer.avatar_url);
          onAvatarChange?.(localFarmer.avatar_url);
        }
      }
    }
  }, [initialProfile, onAvatarChange]);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // General Status
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Avatar Upload / Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarStatus({ type: 'error', text: 'Please select a valid image file (PNG, JPG, WebP).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarStatus({ type: 'error', text: 'Image file size must be less than 5MB.' });
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarStatus(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const res = await updateAvatarAction(base64Data);

      setIsUploadingAvatar(false);
      if (res.success) {
        const finalUrl = res.avatarUrl || base64Data;
        setAvatarUrl(finalUrl);
        onAvatarChange?.(finalUrl);
        setAvatarStatus({ type: 'success', text: t('prof_avatar_success') });
      } else {
        setAvatarStatus({ type: 'error', text: res.error || 'Failed to update avatar photo.' });
      }
    };
    reader.onerror = () => {
      setIsUploadingAvatar(false);
      setAvatarStatus({ type: 'error', text: 'Failed to read image file.' });
    };
    reader.readAsDataURL(file);
  };

  // Avatar Removal
  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    setAvatarStatus(null);
    const res = await updateAvatarAction(null);
    setIsUploadingAvatar(false);
    if (res.success) {
      setAvatarUrl(null);
      onAvatarChange?.(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setAvatarStatus({ type: 'success', text: t('prof_avatar_success') });
    } else {
      setAvatarStatus({ type: 'error', text: res.error || 'Failed to remove avatar.' });
    }
  };

  // Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', text: t('prof_password_length') });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', text: t('prof_password_mismatch') });
      return;
    }

    setIsChangingPassword(true);
    const formData = new FormData();
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);

    const res = await changePasswordAction(formData);
    setIsChangingPassword(false);

    if (res.success) {
      setPasswordStatus({ type: 'success', text: t('prof_password_success') });
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordStatus({ type: 'error', text: res.error || 'Failed to change password.' });
    }
  };

  const toggleCrop = (crop: EthiopianCrop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    startTransition(async () => {
      // Check if offline
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        const offlineProfile: FarmerProfile = {
          id: initialProfile?.id || `offline_farmer_${Date.now()}`,
          full_name: fullName,
          phone,
          region,
          zone_name: zoneName,
          woreda,
          agro_ecological_zone: agroZone,
          main_crops: selectedCrops,
          preferred_language: preferredLanguage,
          farm_size_hectares: farmSize ? Number(farmSize) : undefined,
          avatar_url: avatarUrl,
          created_at: initialProfile?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setOfflineAuthCookies(offlineProfile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('root_active_farmer', JSON.stringify(offlineProfile));
        }
        setGlobalLanguage(preferredLanguage);
        setStatusMessage({
          type: 'success',
          text: t('prof_success_msg'),
        });
        return;
      }

      try {
        const result = await updateFarmerProfileAction({
          fullName,
          phone,
          region,
          zoneName,
          woreda,
          agroZone,
          mainCrops: selectedCrops,
          preferredLanguage,
          farmSizeHectares: farmSize ? Number(farmSize) : undefined,
          avatarUrl,
        });

        if (result.success) {
          setGlobalLanguage(preferredLanguage);
          setStatusMessage({
            type: 'success',
            text: t('prof_success_msg'),
          });
        } else {
          setStatusMessage({
            type: 'error',
            text: result.error || 'Failed to update profile. Please try again.',
          });
        }
      } catch {
        // Fallback to local save if network drops
        const offlineProfile: FarmerProfile = {
          id: initialProfile?.id || `offline_farmer_${Date.now()}`,
          full_name: fullName,
          phone,
          region,
          zone_name: zoneName,
          woreda,
          agro_ecological_zone: agroZone,
          main_crops: selectedCrops,
          preferred_language: preferredLanguage,
          farm_size_hectares: farmSize ? Number(farmSize) : undefined,
          avatar_url: avatarUrl,
          created_at: initialProfile?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setOfflineAuthCookies(offlineProfile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('root_active_farmer', JSON.stringify(offlineProfile));
        }
        setGlobalLanguage(preferredLanguage);
        setStatusMessage({
          type: 'success',
          text: t('prof_success_msg'),
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* 1. Profile Picture Card with Dynamic Hover & File Picker */}
      {/* ============================================================ */}
      <Card className="bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>{t('prof_avatar_title')}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              JPG, PNG, WebP (Max 5MB)
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {t('prof_avatar_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {avatarStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                avatarStatus.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/40 text-red-200'
              }`}
            >
              {avatarStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{avatarStatus.text}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-5 p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
            {/* Avatar Preview with Camera Overlay */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-emerald-500/40 bg-slate-900 shadow-lg shadow-emerald-950/40 transition-all duration-300 group-hover:scale-105 group-hover:ring-emerald-400 flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={fullName || 'Farmer Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 flex items-center justify-center text-slate-950 font-black text-2xl">
                    {(fullName || 'F')[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Hover Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                aria-label="Upload photo"
                className="absolute inset-0 rounded-2xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer backdrop-blur-[2px]"
              >
                <Camera className="w-5 h-5 text-emerald-300 drop-shadow" />
                <span className="text-[9px] font-semibold text-emerald-200 mt-1">
                  {t('prof_avatar_change')}
                </span>
              </button>
            </div>

            {/* Actions & Description */}
            <div className="flex-1 text-center sm:text-left space-y-2.5">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">{fullName || 'Farmer Profile'}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {avatarUrl ? 'Custom photo uploaded' : 'Using default initials avatar'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-3.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('prof_avatar_uploading')}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('prof_avatar_change')}</span>
                    </>
                  )}
                </Button>

                {avatarUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                    className="border-red-500/30 text-red-300 hover:bg-red-950/50 hover:text-red-200 hover:border-red-500/50 text-xs h-9 px-3 rounded-xl flex items-center gap-1.5 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('prof_avatar_remove')}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* 2. Main Farmer Profile Form */}
      {/* ============================================================ */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/60 border-red-500/40 text-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Personal & Contact Details */}
        <Card className="bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>{t('prof_personal_info')}</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              {t('prof_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium text-slate-300">
                  {t('prof_full_name')}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-slate-950/70 border-slate-800 text-white text-xs h-9 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  {t('prof_phone')}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+251 91 123 4567"
                  className="bg-slate-950/70 border-slate-800 text-white text-xs h-9 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="language" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  {t('prof_language')}
                </Label>
                <select
                  id="language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                  className="w-full h-9 px-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ</option>
                  <option value="om">Afaan Oromoo</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="farmSize" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  {t('prof_farm_size')}
                </Label>
                <Input
                  id="farmSize"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1000"
                  value={farmSize || ''}
                  onChange={(e) => setFarmSize(parseFloat(e.target.value) || undefined)}
                  placeholder="e.g. 2.5"
                  className="bg-slate-950/70 border-slate-800 text-white text-xs h-9 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Agro-Ecological Zone */}
        <Card className="bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Mountain className="w-4 h-4 text-emerald-400" />
              <span>{t('prof_geographic')}</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              {t('prof_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="region" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {t('prof_region')}
                </Label>
                <select
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value as EthiopianRegion)}
                  className="w-full h-9 px-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {tRegion(r)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zoneName" className="text-xs font-medium text-slate-300">
                  {t('prof_zone_name')}
                </Label>
                <Input
                  id="zoneName"
                  type="text"
                  placeholder="e.g. East Shewa"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  className="bg-slate-950/70 border-slate-800 text-white text-xs h-9 focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="woreda" className="text-xs font-medium text-slate-300">
                  {t('prof_woreda')}
                </Label>
                <Input
                  id="woreda"
                  type="text"
                  placeholder="e.g. Ada'a"
                  value={woreda}
                  onChange={(e) => setWoreda(e.target.value)}
                  className="bg-slate-950/70 border-slate-800 text-white text-xs h-9 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <Label htmlFor="agroZone" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                {t('prof_agro_zone')}
              </Label>
              <select
                id="agroZone"
                value={agroZone}
                onChange={(e) => setAgroZone(e.target.value as AgroEcologicalZone)}
                className="w-full h-9 px-3 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {tZone(z)}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Main Crops */}
        <Card className="bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>{t('prof_main_crops')}</span>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40">
                {selectedCrops.length} Selected
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              {t('prof_subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ALL_ETHIOPIAN_CROPS_KEYS.map((crop) => {
                const isSelected = selectedCrops.includes(crop.name);
                return (
                  <button
                    key={crop.name}
                    type="button"
                    onClick={() => toggleCrop(crop.name)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all duration-200 text-left hover:-translate-y-0.5 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-semibold shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 hover:bg-slate-900/70 hover:shadow-[0_0_12px_-2px_rgba(16,185,129,0.25)]'
                    }`}
                  >
                    <span className="text-lg">{crop.icon}</span>
                    <span className="truncate">{tCrop(crop.name)}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs h-10 rounded-xl border border-emerald-400/40 hover:border-emerald-300 shadow-lg shadow-emerald-950/60 hover:shadow-[0_0_25px_-3px_rgba(16,185,129,0.45)] hover:ring-1 hover:ring-emerald-400/50 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-98"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('prof_btn_saving')}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{t('prof_btn_save')}</span>
            </>
          )}
        </Button>
      </form>

      {/* ============================================================ */}
      {/* 3. Change Password Card with Show/Hide Eye & Full Multilingual */}
      {/* ============================================================ */}
      <Card className="bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.3)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>{t('prof_password_title')}</span>
            </div>
            <Lock className="w-3.5 h-3.5 text-slate-500" />
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {t('prof_password_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passwordStatus && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/60 border-red-500/40 text-red-200'
                }`}
              >
                {passwordStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span>{passwordStatus.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* New Password */}
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-medium text-slate-300">
                  {t('prof_password_new')}
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="bg-slate-950/70 border-slate-800 text-white text-xs h-9 pr-9 focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle new password visibility"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-0.5"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-300">
                  {t('prof_password_confirm')}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="bg-slate-950/70 border-slate-800 text-white text-xs h-9 pr-9 focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-0.5"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword || !newPassword || !confirmPassword}
              variant="outline"
              className="w-full sm:w-auto bg-slate-950/80 hover:bg-slate-900 border border-slate-700 hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400/40 hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.35)] text-white font-semibold text-xs h-9 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-98 transition-all duration-200"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('prof_password_updating')}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('prof_password_btn')}</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
