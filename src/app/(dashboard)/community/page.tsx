import { getCurrentFarmerProfile } from '@/app/auth/actions';
import { Navbar } from '@/components/shared/navbar';
import { searchCommunityKnowledge } from '@/lib/supabase/db-helpers';
import { Users, Sprout, ThumbsUp, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

interface CommunityPageProps {
  searchParams: Promise<{
    crop?: string;
    region?: string;
  }>;
}

const CROP_FILTER_CHIPS: Array<{ name: string; label: string; icon: string }> = [
  { name: '', label: 'All Crops (ሁሉም)', icon: '🌾' },
  { name: 'Teff', label: 'Teff (ጤፍ)', icon: '🌱' },
  { name: 'Wheat', label: 'Wheat (ስንዴ)', icon: '🌾' },
  { name: 'Maize', label: 'Maize (በቆሎ)', icon: '🌽' },
  { name: 'Coffee', label: 'Coffee (ቡና)', icon: '☕' },
  { name: 'Barley', label: 'Barley (ገብስ)', icon: '🌾' },
  { name: 'Potato', label: 'Potato (ድንች)', icon: '🥔' },
];

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const { crop = '', region = '' } = await searchParams;
  const profile = await getCurrentFarmerProfile();

  // Retrieve community knowledge
  const knowledgeItems = await searchCommunityKnowledge({
    crop: crop || undefined,
    region: region || undefined,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <Navbar userEmail={profile?.email} farmerName={profile?.full_name} />

      <main className="flex-1 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-24 sm:pb-12 w-full space-y-6">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Peer-Verified Ethiopian Agronomy • የማህበረሰብ እውቀት</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Community Knowledge Hub <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              የአርሶ አደሮች የጋራ ተሞክሮ
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Practical remedies tested, upvoted, and proven by smallholders across Oromia, Amhara, Tigray, and Southern regions.
          </p>
        </div>

        {/* Crop Filter Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              Filter by Crop (በሰብል ይለዩ):
            </span>
            <span>{knowledgeItems.length} verified solutions</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none touch-manipulation">
            {CROP_FILTER_CHIPS.map((chip) => {
              const isSelected = crop.toLowerCase() === chip.name.toLowerCase();
              return (
                <Link
                  key={chip.name}
                  href={chip.name ? `/community?crop=${encodeURIComponent(chip.name)}` : '/community'}
                  className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Knowledge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {knowledgeItems.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-900/70 border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between backdrop-blur-sm"
            >
              <CardHeader className="p-4 sm:p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[10px]">
                      {item.crop_type}
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 text-slate-400 text-[10px]">
                      {item.agro_zone || 'Weyna Dega'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{item.verified_by_farmers_count} Farmers</span>
                  </div>
                </div>

                <CardTitle className="text-sm sm:text-base font-bold text-white leading-snug">
                  {item.problem_title}
                </CardTitle>

                {item.symptoms && (
                  <CardDescription className="text-xs text-slate-300 mt-1 line-clamp-2">
                    &ldquo;{item.symptoms}&rdquo;
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
                {/* Solution Box */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Proven Farmer Solution (የተረጋገጠ መፍትሄ)
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {item.proven_solution}
                  </p>
                </div>

                {/* Card Footer Meta */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {item.region || 'Ethiopia'}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    Peer Verified
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Have a problem with your own crop?
            </h3>
            <p className="text-xs text-slate-300">
              Run the 5-Agent Council now to get a customized, low-cost Advice Card.
            </p>
          </div>

          <Link href="/diagnose" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-colors">
              Start Diagnosis • ምርመራ ጀምር
            </button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Root Ethiopia • Agricultural Advisory Intelligence
      </footer>
    </div>
  );
}
