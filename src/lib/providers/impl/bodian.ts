import axios from 'axios';
import { MusicItem, MusicProvider, PlayInfo } from '@/types/music';

const SEARCH_API_URL = 'https://bd-api.kuwo.cn/api/search/music/list';
const CGG_API_URL = 'https://kw-api.cenguigui.cn/';
const TIANBAO_API_URL = 'https://mobi.kuwo.cn/mobi.s';
const REQUEST_TIMEOUT = 20000;

const SEARCH_HEADERS = {
  'user-agent': 'Dart/3.3 (dart:io)',
  'plat': 'win',
  'accept-encoding': 'gzip',
  'api-ver': 'application/json',
  'channel': 'W1',
  'brand': 'Windows 11 Pro for Workstations',
  'net': 'wifi',
  'content-type': 'application/json',
  'ver': '1.1.5',
  'svrver': '13',
  'devid': 'coco-bodian',
  'qimei36': 'coco-bodian',
};

type BodianSearchItem = {
  id?: string | number;
  name?: string;
  artist?: string;
  album?: string;
  albumPic?: string;
  freeSign?: string;
  fsig?: string;
};

function extractExt(url: string, fallback = 'mp3') {
  const clean = url.split('?')[0];
  const parts = clean.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : fallback;
}

function normalizeCover(value?: string) {
  return value || undefined;
}

export class BodianProvider implements MusicProvider {
  name = 'bodian';

  async search(query: string): Promise<MusicItem[]> {
    try {
      const { data } = await axios.get(SEARCH_API_URL, {
        headers: SEARCH_HEADERS,
        params: {
          pn: '0',
          rn: '10',
          keyword: query.trim(),
          correct: '1',
          uid: '-1',
          token: '',
        },
        timeout: REQUEST_TIMEOUT,
      });

      const list = (((data || {}).data || {}).resultList || []) as BodianSearchItem[];
      return list
        .map((item) => ({
          id: String(item.id || ''),
          title: String(item.name || '').trim(),
          artist: item.artist || '未知歌手',
          album: item.album || undefined,
          cover: normalizeCover(item.albumPic),
          provider: this.name,
          extra: {
            albumPic: item.albumPic || undefined,
            freeSign: item.freeSign || item.fsig || undefined,
          },
        }))
        .filter((item) => item.id && item.title);
    } catch (error) {
      console.error('Bodian search error:', error);
      return [];
    }
  }

  async getPlayInfo(id: string, extra?: unknown): Promise<PlayInfo> {
    try {
      const fallbackCover = this.extractCover(extra);
      try {
        const info = await this.getByCenguigui(id);
        return {
          url: info.url,
          type: extractExt(info.url, 'flac'),
          cover: info.cover || fallbackCover,
          bitrate: info.bitrate,
        };
      } catch {
        const info = await this.getByTianbao(id);
        return {
          url: info.url,
          type: extractExt(info.url, 'flac'),
          cover: fallbackCover,
          bitrate: info.bitrate,
        };
      }
    } catch (error) {
      console.error('Bodian getPlayInfo error:', error);
      throw error;
    }
  }

  private extractCover(extra: unknown) {
    const payload = extra as { albumPic?: string } | undefined;
    return payload?.albumPic || undefined;
  }

  private async getByCenguigui(id: string) {
    const { data } = await axios.get(CGG_API_URL, {
      params: {
        id,
        type: 'song',
        level: 'lossless',
        format: 'json',
      },
      timeout: REQUEST_TIMEOUT,
    });

    const payload = (data || {}).data || {};
    const url = String(payload.url || '').trim();
    if (!url.startsWith('http')) {
      throw new Error('Invalid cenguigui url');
    }

    return {
      url,
      cover: payload.pic ? String(payload.pic) : undefined,
      bitrate: 'lossless',
    };
  }

  private async getByTianbao(id: string) {
    const { data } = await axios.get(TIANBAO_API_URL, {
      headers: {
        'User-Agent': 'Dart/2.19 (dart:io)',
        'plat': 'ar',
        'channel': 'aliopen',
      },
      params: {
        f: 'web',
        user: '2333333',
        source: 'kwplayerhd_ar_4.3.0.8_tianbao_T1A_qirui.apk',
        type: 'convert_url_with_sign',
        br: '2000kflac',
        rid: id,
      },
      timeout: REQUEST_TIMEOUT,
    });

    const payload = (data || {}).data || {};
    const url = String(payload.url || '').trim();
    if (!url.startsWith('http')) {
      throw new Error('Invalid tianbao url');
    }

    return {
      url,
      bitrate: '2000kflac',
    };
  }
}
