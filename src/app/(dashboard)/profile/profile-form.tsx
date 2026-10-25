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
  Compass, 
  HardDrive 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FarmerProfile, EthiopianRegion, AgroEcologicalZone, SupportedLanguage, EthiopianCrop } from '@/lib/types';
import { updateFarmerProfileAction } from '@/app/auth/actions';

interface ProfileFormProps {
  initialProfile: FarmerProfile | null;
}

const ALL_ETHIOPIAN_CROPS: Array<{ name: EthiopianCrop; label: string; icon: string }> = [
  { name: 'Teff', label: 'Teff (ጤፍ)', icon: '🌱' },
  { name: 'Wheat', label: 'Wheat (ስንዴ)', icon: '🌾' },
  { name: 'Maize', label: 'Maize (በቆሎ)', icon: '🌽' },
  { name: 'Coffee', label: 'Coffee (ቡና)', icon: '☕' },
  { name: 'Barley', label: 'Barley (ገብስ)', icon: '🌾' },
  { name: 'Enset', label: 'Enset (እንሰት)', icon: '🌿' },
  { name: 'Faba Bean', label: 'Faba Bean (ባቄላ)', icon: '🫘' },
  { name: 'Chickpea', label: 'Chickpea (ሽምብራ)', icon: '🌱' },
  { name: 'Potato', label: 'Potato (ድንች)', icon: '🥔' },
  { name: 'Tomato', label: 'Tomato (ቲማቲም)', icon: '🍅' },
  { name: 'Onion', label: 'Onion (ሽንኩርት)', icon: '🧅' },
  { name: 'Sorghum', label: 'Sorghum (ማሽላ)', icon: '🌾' },
];

export function ProfileForm({ initialProfile }: ProfileFormProps) {
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
        setStatusMessage({
          type: 'success',
          text: 'Farmer profile and agricultural preferences updated successfully!',
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
            Farmer Details (የአርሶ አደር መረጃ)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Basic contact information for tailored advisory alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-medium text-slate-300">
                Full Name
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
                Phone Number
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
                Preferred Language
              </Label>
              <select
                id="language"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                className="w-full h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="en">English (Official Advice)</option>
                <option value="am">አማርኛ (Amharic)</option>
                <option value="om">Afaan Oromoo (Oromo)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="farmSize" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                Total Farm Size (Hectares)
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
            Location & Agro-Ecological Zone (የአየር ንብረትና መልክዓ ምድር)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Crucial for the Local Context Agent to recommend suitable pest treatments & planting seasons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="region" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Region (ክልል)
              </Label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value as EthiopianRegion)}
                className="w-full h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Oromia">Oromia (ኦሮሚያ)</option>
                <option value="Amhara">Amhara (አማራ)</option>
                <option value="Tigray">Tigray (ትግራይ)</option>
                <option value="Sidama">Sidama (ሲዳማ)</option>
                <option value="Central Ethiopia">Central Ethiopia</option>
                <option value="South Ethiopia">South Ethiopia</option>
                <option value="Somali">Somali</option>
                <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                <option value="Afar">Afar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="zoneName" className="text-xs font-medium text-slate-300">
                Zone / ዞን (Optional)
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
                Woreda / ወረዳ (Optional)
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

          {/* Agro-Ecological Zone Selection */}
          <div className="space-y-2 pt-2">
            <Label className="text-xs font-semibold text-slate-300">
              Agro-Ecological Zone (የአየር ንብረት ቀጠና)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { zone: 'Weyna Dega' as AgroEcologicalZone, label: 'Weyna Dega', desc: 'Midland 1500–2400m', tag: 'Moderate' },
                { zone: 'Dega' as AgroEcologicalZone, label: 'Dega', desc: 'Highland >2400m', tag: 'Cool/Frost' },
                { zone: 'Kolla' as AgroEcologicalZone, label: 'Kolla', desc: 'Lowland 500–1500m', tag: 'Warm/Semi-arid' },
                { zone: 'Bereha' as AgroEcologicalZone, label: 'Bereha', desc: 'Arid <500m', tag: 'Hot/Dry' },
              ].map((item) => {
                const isSelected = agroZone === item.zone;
                return (
                  <button
                    key={item.zone}
                    type="button"
                    onClick={() => setAgroZone(item.zone)}
                    className={`p-3 rounded-xl border text-left transition-all touch-manipulation active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{item.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    <Badge variant="outline" className="mt-1 text-[9px] py-0 px-1 border-slate-700">
                      {item.tag}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Main Crops Multi-Select */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Main Crops Cultivated (የሚያመርቷቸው ሰብሎች)
            </CardTitle>
            <Badge className="bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[10px]">
              {selectedCrops.length} selected
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-400">
            Select the principal crops you grow. The Diagnostic Agent prioritizes pathogens common to these crops.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ALL_ETHIOPIAN_CROPS.map((crop) => {
              const isSelected = selectedCrops.includes(crop.name);
              return (
                <button
                  key={crop.name}
                  type="button"
                  onClick={() => toggleCrop(crop.name)}
                  className={`p-2 sm:p-2.5 min-h-[44px] rounded-xl border text-xs flex items-center justify-between transition-all touch-manipulation active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold ring-1 ring-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="shrink-0">{crop.icon}</span>
                    <span className="truncate">{crop.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Offline Storage Notice */}
      <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-3 sm:p-3.5 flex items-start gap-3 text-xs text-slate-400">
        <HardDrive className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Offline Profile Sync:</strong> Your preferences are cached locally on this device. When offline in remote fields, multi-agent advisory runs will continue referencing your regional agro-zone and crop types seamlessly.
        </p>
      </div>


      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto min-h-[46px] sm:min-h-[40px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 h-11 sm:h-10 shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 touch-manipulation"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Preferences...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Farmer Profile</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
