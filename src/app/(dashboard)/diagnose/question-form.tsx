'use client';

import { useState, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  X, 
  Sprout, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EthiopianCrop, EthiopianRegion, AgroEcologicalZone, FarmerProfile } from '@/lib/types';
import { submitCropQuestionAction } from '@/app/actions/diagnose';

interface QuestionFormProps {
  initialProfile?: FarmerProfile | null;
}

const CROPS_LIST: Array<{ name: EthiopianCrop; label: string; icon: string }> = [
  { name: 'Teff', label: 'Teff (ጤፍ)', icon: '🌱' },
  { name: 'Wheat', label: 'Wheat (ስንዴ)', icon: '🌾' },
  { name: 'Maize', label: 'Maize (በቆሎ)', icon: '🌽' },
  { name: 'Coffee', label: 'Coffee (ቡና)', icon: '☕' },
  { name: 'Barley', label: 'Barley (ገብስ)', icon: '🌾' },
  { name: 'Enset', label: 'Enset (እንሰት)', icon: '🌿' },
  { name: 'Faba Bean', label: 'Faba Bean (ባቄላ)', icon: '🫘' },
  { name: 'Potato', label: 'Potato (ድንች)', icon: '🥔' },
  { name: 'Tomato', label: 'Tomato (ቲማቲም)', icon: '🍅' },
  { name: 'Onion', label: 'Onion (ሽንኩርት)', icon: '🧅' },
];

const COMMON_SYMPTOM_TAGS = [
  'Yellow powdery stripes on leaves',
  'Orange-brown pustules on stems',
  'Dark sunken lesions on berries',
  'Ragged leaf holes with frass in whorls',
  'Sudden wilting & slimy bacterial ooze',
  'Curled leaves with white mildew',
];

export function QuestionForm({ initialProfile }: QuestionFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCrop, setSelectedCrop] = useState<EthiopianCrop>(
    initialProfile?.main_crops?.[0] || 'Wheat'
  );
  const [title, setTitle] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [region, setRegion] = useState<EthiopianRegion>(initialProfile?.region || 'Oromia');
  const [agroZone, setAgroZone] = useState<AgroEcologicalZone>(
    initialProfile?.agro_ecological_zone || 'Weyna Dega'
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 8MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addSymptomTag = (tag: string) => {
    if (!symptoms) {
      setSymptoms(tag);
    } else if (!symptoms.includes(tag)) {
      setSymptoms((prev) => `${prev}. ${tag}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setErrorMessage('Please describe the symptoms observed on your crop.');
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      const result = await submitCropQuestionAction({
        title: title.trim() || `${selectedCrop} Disease Issue`,
        cropType: selectedCrop,
        symptoms: symptoms.trim(),
        photoBase64,
        region,
        agroZone,
      });

      if (result.success && result.questionId) {
        router.push(`/diagnose/${result.questionId}`);
      } else {
        setErrorMessage(result.error || 'Failed to analyze crop. Please retry.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Crop Selection */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            1. Select Affected Crop (ሰብሉን ይምረጡ)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Choose the crop displaying disease or pest symptoms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {CROPS_LIST.map((crop) => {
              const isSelected = selectedCrop === crop.name;
              return (
                <button
                  key={crop.name}
                  type="button"
                  onClick={() => setSelectedCrop(crop.name)}
                  className={`p-2.5 rounded-xl border text-xs flex flex-col items-center justify-center text-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl">{crop.icon}</span>
                  <span className="text-[11px] truncate w-full">{crop.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Photo Upload / Camera Capture */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>2. Crop Photo (ፎቶ ያንሱ ወይም ይስቀሉ)</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">
              Optional but Recommended
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Take a clear photo of the leaf, stem, fruit, or affected plant section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
            id="crop-photo-input"
          />

          {photoBase64 ? (
            <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 max-h-64 bg-slate-950 flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoBase64}
                alt="Selected crop symptom preview"
                className="max-h-64 w-full object-contain"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition-colors shadow-lg"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/80 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-white">
                Tap to take a photo or select from gallery
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Works on phone cameras • PNG, JPG up to 8MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Symptom Description */}
      <Card className="bg-slate-900/70 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            3. Describe What You See (ምልክቶቹን ይግለጹ)
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Tell the AI agent what the leaves, stems, or soil look like
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-slate-300">
              Question Title (አርዕስት - Optional)
            </Label>
            <Input
              id="title"
              type="text"
              placeholder={`e.g. Yellow leaf rust on ${selectedCrop}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-xs h-9 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="q-region" className="text-xs font-semibold text-slate-300">
                Region (ክልል)
              </Label>
              <select
                id="q-region"
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
              <Label htmlFor="q-agroZone" className="text-xs font-semibold text-slate-300">
                Agro-Zone (ቀጠና)
              </Label>
              <select
                id="q-agroZone"
                value={agroZone}
                onChange={(e) => setAgroZone(e.target.value as AgroEcologicalZone)}
                className="w-full h-9 px-3 rounded-md bg-slate-950/70 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Weyna Dega">Weyna Dega (Midland 1500–2400m)</option>
                <option value="Dega">Dega (Highland &gt;2400m)</option>
                <option value="Kolla">Kolla (Lowland 500–1500m)</option>
                <option value="Bereha">Bereha (Arid &lt;500m)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="symptoms" className="text-xs font-semibold text-slate-300">
              Observed Symptoms (የታዩ ምልክቶች)
            </Label>
            <Textarea
              id="symptoms"
              rows={4}
              required
              placeholder="e.g. Yellow powdery lines appear on the leaves. Plants are lodging after the morning dew, and grain heads are thin..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 text-xs focus:border-emerald-500"
            />
          </div>

          {/* Quick Symptom Tags for Low-Literacy / Fast Input */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Quick Select Common Symptoms:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOM_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addSymptomTag(tag)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Diagnostic Agent Running (Ollama / Offline Engine)...</span>
          </>
        ) : (
          <>
            <Bot className="w-5 h-5" />
            <span>Deploy Diagnostic Agent • ምርመራ ጀምር</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </Button>
    </form>
  );
}
