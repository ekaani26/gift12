export type Scene = 'video' | 'mystery-box';

export type SunsetAtmosphere = 'little' | 'more' | 'full';

export type BoxState = 'idle' | 'anticipation' | 'opening' | 'revealed';

export interface MysteryPrize {
  id: string;
  title: string;
  tier: string;
  description: string;
  code: string;
  discount: string;
  avatarIcon: string;
  perks: string[];
  premiumPackaging: boolean;
}


