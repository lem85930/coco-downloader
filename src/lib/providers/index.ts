import { MusicProvider } from '@/types/music';
import { GequbaoProvider } from './impl/gequbao';
import { GequhaiProvider } from './impl/gequhai';
import { BuguProvider } from './impl/bugu';
import { BodianProvider } from './impl/bodian';
import { QQProvider } from './impl/qq';
import { QQMp3Provider } from './impl/qqmp3';
import { MiguProvider } from './impl/migu';
import { LivepooProvider } from './impl/livepoo';
import { JianbinProvider } from './impl/jianbin';
import { AitingProvider } from './impl/aiting';
import { JooxProvider } from './impl/joox';

const providers: Record<string, MusicProvider> = {
  gequbao: new GequbaoProvider(),
  gequhai: new GequhaiProvider(),
  bugu: new BuguProvider(),
  bodian: new BodianProvider(),
  qq: new QQProvider(),
  qqmp3: new QQMp3Provider(),
  mitu: new QQMp3Provider('mitu'),
  joox: new JooxProvider(),
  migu: new MiguProvider(),
  livepoo: new LivepooProvider(),
  aiting: new AitingProvider(),
  'jianbin-netease': new JianbinProvider('jianbin-netease', 'netease'),
  'jianbin-qq': new JianbinProvider('jianbin-qq', 'qq'),
  'jianbin-kugou': new JianbinProvider('jianbin-kugou', 'kugou'),
  'jianbin-kuwo': new JianbinProvider('jianbin-kuwo', 'kuwo'),
};

export function getProvider(name: string = 'gequbao'): MusicProvider {
  return providers[name] || providers['gequbao'];
}

export function getAllProviders(): MusicProvider[] {
  return Object.values(providers);
}
