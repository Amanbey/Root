'use client';

import { useState, useTransition } from 'react';
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
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FarmerProfile, EthiopianRegion, AgroEcologicalZone, SupportedLanguage, EthiopianCrop } from '@/lib/types';
import { updateFarmerProfileAction } from '@/app/auth/actions';
import { useLanguage } from '@/lib/i18n/language-context';

interface ProfileFormProps {
  initialProfile: FarmerProfile | null;
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

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { t, tCrop, tZone, tRegion, setLanguage: setGlobalLanguage } = useLanguage();

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

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleCrop = (crop: EthiopianCrop) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    startTransition(async () => {
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
    });
  };

  return (
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

      {/* 1. Personal & Contact Details */}
      <Card className="bg-slate-900/70 border-slate-800">
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
                className="bg-slate-950/70 border-slate-800 text-white text-xs h-9"
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
                className="bg-slate-950/70 border-slate-800 text-white text-xs h-9"
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
                className="w-full h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
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
                className="bg-slate-950/70 border-slate-800 text-white text-xs h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Location & Agro-Ecological Zone */}
      <Card className="bg-slate-900/70 border-slate-800">
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
                className="w-full h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
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
                className="bg-slate-950/70 border-slate-800 text-white text-xs h-9"
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
                className="bg-slate-950/70 border-slate-800 text-white text-xs h-9"
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
              className="w-full h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
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

      {/* 3. Main Crops */}
      <Card className="bg-slate-900/70 border-slate-800">
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
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-semibold shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
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
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-98"
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
  );
}
