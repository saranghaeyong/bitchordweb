import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback high quality music catalogue
const CATALOGUE = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    artist: 'Lofi Girl',
    channelTitle: 'Lofi Girl',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    duration: 180,
    durationFormatted: '3:00',
    views: '12M',
  },
  {
    id: '5yx6BWlEVcY',
    title: 'Chillhop Essentials - Summer Vibes',
    artist: 'Chillhop Music',
    channelTitle: 'Chillhop Music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    duration: 215,
    durationFormatted: '3:35',
    views: '8.4M',
  },
  {
    id: 'DWcJFNfaw9c',
    title: 'Coffee Shop Ambience & Soft Jazz',
    artist: 'Cafe Music BGM',
    channelTitle: 'Cafe Music BGM channel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
    duration: 240,
    durationFormatted: '4:00',
    views: '5.1M',
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    channelTitle: 'Queen Official',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    duration: 354,
    durationFormatted: '5:54',
    views: '1.7B',
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    channelTitle: 'Luis Fonsi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    duration: 282,
    durationFormatted: '4:42',
    views: '8.2B',
  },
  {
    id: 'JGwWNGJdvx8',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    channelTitle: 'Ed Sheeran',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    duration: 233,
    durationFormatted: '3:53',
    views: '6.1B',
  },
  {
    id: '09R8_2nJtjg',
    title: 'Sugar',
    artist: 'Maroon 5',
    channelTitle: 'Maroon 5',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
    duration: 301,
    durationFormatted: '5:01',
    views: '3.9B',
  },
  {
    id: 'OPf0YbXqDm0',
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    channelTitle: 'Mark Ronson',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    duration: 270,
    durationFormatted: '4:30',
    views: '4.8B',
  },
  {
    id: '4xDzrJKXOOY',
    title: 'Synthwave Radio - Chill synth / Retro beats',
    artist: 'Lofi Girl Synthwave',
    channelTitle: 'Lofi Girl',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    duration: 210,
    durationFormatted: '3:30',
    views: '6.2M',
  },
  {
    id: 'ALZHF5UqnU4',
    title: 'Alone',
    artist: 'Marshmello',
    channelTitle: 'Marshmello',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    duration: 199,
    durationFormatted: '3:19',
    views: '2.4B',
  },
  {
    id: '60ItHLz5WEA',
    title: 'Faded',
    artist: 'Alan Walker',
    channelTitle: 'Alan Walker',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&auto=format&fit=crop&q=80',
    duration: 212,
    durationFormatted: '3:32',
    views: '3.4B',
  },
  {
    id: 'YqeW9_5kURI',
    title: 'Lean On',
    artist: 'Major Lazer & DJ Snake ft. MØ',
    channelTitle: 'Major Lazer Official',
    thumbnailUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&auto=format&fit=crop&q=80',
    duration: 176,
    durationFormatted: '2:56',
    views: '3.3B',
  },
  {
    id: 'hT_nvWreIhg',
    title: 'Counting Stars',
    artist: 'OneRepublic',
    channelTitle: 'OneRepublic',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
    duration: 267,
    durationFormatted: '4:27',
    views: '3.8B',
  },
  {
    id: '7wtfhZwyrcc',
    title: 'Believer',
    artist: 'Imagine Dragons',
    channelTitle: 'ImagineDragons',
    thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
    duration: 204,
    durationFormatted: '3:24',
    views: '2.5B',
  },
  {
    id: 'ktvTqknDobU',
    title: 'Radioactive',
    artist: 'Imagine Dragons',
    channelTitle: 'ImagineDragons',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&auto=format&fit=crop&q=80',
    duration: 261,
    durationFormatted: '4:21',
    views: '1.6B',
  },
  {
    id: 'kXYiU_JCYtU',
    title: 'Numb',
    artist: 'Linkin Park',
    channelTitle: 'Linkin Park',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    duration: 187,
    durationFormatted: '3:07',
    views: '2.1B',
  },
  {
    id: '4NRXx6U8ABQ',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    channelTitle: 'The Weeknd',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    duration: 200,
    durationFormatted: '3:20',
    views: '2.9B',
  },
  {
    id: '3tmd-ClpJxA',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    channelTitle: 'The Weeknd',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=80',
    duration: 230,
    durationFormatted: '3:50',
    views: '2.2B',
  },
  {
    id: 'tvTRZJ-4EyI',
    title: 'God\'s Plan',
    artist: 'Drake',
    channelTitle: 'Drake',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=600&auto=format&fit=crop&q=80',
    duration: 198,
    durationFormatted: '3:18',
    views: '1.5B',
  },
  {
    id: 'pRpeEdMmmQ0',
    title: 'Waka Waka (This Time for Africa)',
    artist: 'Shakira ft. Freshlyground',
    channelTitle: 'Shakira',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=600&auto=format&fit=crop&q=80',
    duration: 211,
    durationFormatted: '3:31',
    views: '3.6B',
  },
  {
    id: 'gdZLi9oWNZg',
    title: 'Dynamite',
    artist: 'BTS',
    channelTitle: 'HYBE LABELS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    duration: 199,
    durationFormatted: '3:19',
    views: '1.7B',
  },
  {
    id: '2S24h70y340',
    title: 'How You Like That',
    artist: 'BLACKPINK',
    channelTitle: 'BLACKPINK',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=600&auto=format&fit=crop&q=80',
    duration: 184,
    durationFormatted: '3:04',
    views: '1.2B',
  },
  {
    id: 'pSUydWEqKwE',
    title: 'Spring Day',
    artist: 'BTS',
    channelTitle: 'HYBE LABELS',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80',
    duration: 275,
    durationFormatted: '4:35',
    views: '540M',
  },
  {
    id: 'DeumyOzKqgI',
    title: 'Deep Focus - Ambient Study Soundscape',
    artist: 'Lofi & Ambient World',
    channelTitle: 'Ambient Chill',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    duration: 300,
    durationFormatted: '5:00',
    views: '4.2M',
  },
  {
    id: 'UfcAVejslrU',
    title: 'Weightless',
    artist: 'Marconi Union',
    channelTitle: 'Just Music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    duration: 485,
    durationFormatted: '8:05',
    views: '85M',
  }
];

// Parse ISO 8601 duration (e.g., PT3M45S)
function parseDuration(isoDuration?: string): { seconds: number; formatted: string } {
  if (!isoDuration) return { seconds: 210, formatted: '3:30' };
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return { seconds: 210, formatted: '3:30' };
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const formatted = hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return { seconds: totalSeconds, formatted };
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // Health and config status endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasYouTubeKey: Boolean(process.env.YOUTUBE_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // YouTube search endpoint
  app.get('/api/youtube/search', async (req: Request, res: Response) => {
    const query = (req.query.q as string || '').trim();
    const pageToken = (req.query.pageToken as string) || '';
    const maxResults = Math.min(parseInt((req.query.maxResults as string) || '20', 10), 30);

    if (!query) {
      return res.json({ items: [], nextPageToken: null, source: 'empty' });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      try {
        const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
        searchUrl.searchParams.set('part', 'snippet');
        searchUrl.searchParams.set('type', 'video');
        searchUrl.searchParams.set('videoCategoryId', '10'); // Music category
        searchUrl.searchParams.set('maxResults', maxResults.toString());
        searchUrl.searchParams.set('q', query);
        searchUrl.searchParams.set('key', apiKey);
        if (pageToken) searchUrl.searchParams.set('pageToken', pageToken);

        const response = await fetch(searchUrl.toString());
        const data = await response.json();

        if (response.ok && data.items) {
          const videoIds = data.items.map((it: any) => it.id?.videoId).filter(Boolean);
          
          let durationMap: Record<string, { seconds: number; formatted: string }> = {};
          if (videoIds.length > 0) {
            try {
              const detailsUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
              detailsUrl.searchParams.set('part', 'contentDetails,statistics');
              detailsUrl.searchParams.set('id', videoIds.join(','));
              detailsUrl.searchParams.set('key', apiKey);

              const detailsRes = await fetch(detailsUrl.toString());
              if (detailsRes.ok) {
                const detailsData = await detailsRes.json();
                for (const item of detailsData.items || []) {
                  durationMap[item.id] = parseDuration(item.contentDetails?.duration);
                }
              }
            } catch (err) {
              console.warn('Could not fetch video details/duration:', err);
            }
          }

          const items = data.items.map((it: any) => {
            const vidId = it.id?.videoId;
            const snippet = it.snippet || {};
            const dur = durationMap[vidId] || { seconds: 210, formatted: '3:30' };

            // Extract artist/title cleanly if formatted as "Artist - Title"
            let title = snippet.title || 'Unknown Title';
            let artist = snippet.channelTitle || 'Unknown Artist';
            if (title.includes(' - ')) {
              const parts = title.split(' - ');
              artist = parts[0].trim();
              title = parts.slice(1).join(' - ').trim();
            }

            return {
              id: vidId,
              title: title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
              artist: artist.replace(/&amp;/g, '&'),
              channelTitle: snippet.channelTitle,
              thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
              duration: dur.seconds,
              durationFormatted: dur.formatted,
              uploadedAt: snippet.publishedAt,
            };
          });

          return res.json({
            items,
            nextPageToken: data.nextPageToken || null,
            source: 'youtube-api',
          });
        }

        console.warn('YouTube search API error/quota issue:', data.error?.message || 'Unknown error');
      } catch (err: any) {
        console.warn('YouTube search fetch failed:', err.message);
      }
    }

    // Fallback search through curated catalogue
    const lowerQuery = query.toLowerCase();
    const filtered = CATALOGUE.filter(track =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.channelTitle.toLowerCase().includes(lowerQuery)
    );

    // If query has no direct substring matches, return relevant tracks
    const results = filtered.length > 0 ? filtered : CATALOGUE.slice(0, 10);

    return res.json({
      items: results,
      nextPageToken: null,
      source: 'catalogue',
      isFallback: true,
      notice: apiKey ? 'YouTube API quota reached or limited. Showing curated catalogue.' : 'Operating in demo mode without YouTube API key.',
    });
  });

  // Trending music endpoint
  app.get('/api/youtube/trending', async (req: Request, res: Response) => {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (apiKey) {
      try {
        const trendUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
        trendUrl.searchParams.set('part', 'snippet,contentDetails,statistics');
        trendUrl.searchParams.set('chart', 'mostPopular');
        trendUrl.searchParams.set('videoCategoryId', '10'); // Music category
        trendUrl.searchParams.set('maxResults', '24');
        trendUrl.searchParams.set('key', apiKey);

        const response = await fetch(trendUrl.toString());
        const data = await response.json();

        if (response.ok && data.items) {
          const items = data.items.map((it: any) => {
            const snippet = it.snippet || {};
            const dur = parseDuration(it.contentDetails?.duration);
            let title = snippet.title || 'Unknown Title';
            let artist = snippet.channelTitle || 'Unknown Artist';
            if (title.includes(' - ')) {
              const parts = title.split(' - ');
              artist = parts[0].trim();
              title = parts.slice(1).join(' - ').trim();
            }

            return {
              id: it.id,
              title: title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
              artist: artist.replace(/&amp;/g, '&'),
              channelTitle: snippet.channelTitle,
              thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
              duration: dur.seconds,
              durationFormatted: dur.formatted,
              views: it.statistics?.viewCount ? `${(parseInt(it.statistics.viewCount, 10) / 1000000).toFixed(1)}M` : undefined,
              uploadedAt: snippet.publishedAt,
            };
          });

          return res.json({ items, source: 'youtube-api' });
        }
      } catch (err: any) {
        console.warn('YouTube trending fetch failed:', err.message);
      }
    }

    // Curated trending tracks
    return res.json({
      items: CATALOGUE,
      source: 'catalogue',
      isFallback: true,
    });
  });

  // AI Music Discovery endpoint (powered by Gemini)
  app.post('/api/ai/discover', async (req: Request, res: Response) => {
    const { prompt, mood, genre, activity } = req.body || {};

    if (!process.env.GEMINI_API_KEY) {
      // Graceful AI suggestion fallback if no GEMINI_API_KEY
      return res.json({
        thought: "BitChord's built-in curator hand-crafted this selection matching your desired vibe.",
        suggestedTheme: mood || genre || 'Curated Soundscape',
        playlistName: `${mood ? mood.toUpperCase() + ' ' : ''}${genre ? genre.toUpperCase() : 'FLOW'} MIX`,
        playlistDescription: `A curated collection tailored for ${activity || 'listening and discovery'}.`,
        suggestedTracks: CATALOGUE.slice(0, 6).map((track, i) => ({
          title: track.title,
          artist: track.artist,
          reason: `Iconic track featuring dynamic rhythm and quintessential ${genre || 'modern'} feel.`,
          moodTags: [mood || 'chill', genre || 'pop', 'curated'],
          track,
        })),
        similarArtists: ['The Weeknd', 'Lofi Girl', 'Imagine Dragons', 'Ed Sheeran'],
        isFallback: true,
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const userQuery = [
        prompt ? `User Prompt: "${prompt}"` : '',
        mood ? `Mood: ${mood}` : '',
        genre ? `Genre: ${genre}` : '',
        activity ? `Activity: ${activity}` : '',
      ].filter(Boolean).join(', ');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are BitChord's master AI music curator and acoustic sound architect.
The user wants music discovery for: ${userQuery}.

Provide a response in JSON format matching the schema:
- thought: A 2-sentence conversational curator introduction explaining why these choices match the listener's mood.
- suggestedTheme: A stylish short theme title (e.g. "Neon Solitude", "Rainy Seoul Cafe", "Velvet Lo-fi Sunset").
- playlistName: A catchy playlist title.
- playlistDescription: A rich, poetic 1-2 sentence description.
- suggestedTracks: Array of 6 real songs. For each:
    - title: Exact real song title
    - artist: Exact artist name
    - reason: Why this song fits the mood/prompt
    - moodTags: Array of 2-3 short descriptive tags
- similarArtists: Array of 4-5 related real artists.

CRITICAL: Only suggest real, famous, well-known songs and artists that exist on YouTube.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              thought: { type: Type.STRING },
              suggestedTheme: { type: Type.STRING },
              playlistName: { type: Type.STRING },
              playlistDescription: { type: Type.STRING },
              suggestedTracks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    artist: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    moodTags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['title', 'artist', 'reason', 'moodTags'],
                },
              },
              similarArtists: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['thought', 'suggestedTheme', 'playlistName', 'playlistDescription', 'suggestedTracks', 'similarArtists'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      // Attach matched tracks from catalogue if available or provide YouTube search fallback
      const enrichedTracks = (parsed.suggestedTracks || []).map((item: any) => {
        const found = CATALOGUE.find(
          t => t.title.toLowerCase().includes(item.title.toLowerCase()) ||
               item.title.toLowerCase().includes(t.title.toLowerCase()) ||
               t.artist.toLowerCase().includes(item.artist.toLowerCase())
        );

        return {
          ...item,
          track: found || {
            id: 'jfKfPfyJRdk', // Default playable seed
            title: item.title,
            artist: item.artist,
            channelTitle: `${item.artist} - Topic`,
            thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
            duration: 210,
            durationFormatted: '3:30',
          },
        };
      });

      return res.json({
        ...parsed,
        suggestedTracks: enrichedTracks,
      });
    } catch (err: any) {
      console.warn('Gemini discovery call failed, falling back to curated AI synthesis:', err.message);
      // Fallback AI recommendation synthesis
      const cleanPrompt = (prompt || mood || genre || 'Chill Flow').toUpperCase();
      const matched = CATALOGUE.filter(t => 
        (prompt && t.title.toLowerCase().includes(prompt.toLowerCase())) ||
        (genre && t.title.toLowerCase().includes(genre.toLowerCase())) ||
        (mood && t.title.toLowerCase().includes(mood.toLowerCase()))
      );
      const chosenTracks = (matched.length >= 4 ? matched : CATALOGUE).slice(0, 6);

      return res.json({
        thought: `Synthesized specialized selections for "${prompt || mood || genre || 'music discovery'}" matching rhythmic pulse and atmospheric texture.`,
        suggestedTheme: `${cleanPrompt.slice(0, 24)} VIBE`,
        playlistName: `${cleanPrompt.slice(0, 20)} Curated Mix`,
        playlistDescription: `A handcrafted selection blending modern rhythms, soothing chords, and atmospheric dynamics.`,
        suggestedTracks: chosenTracks.map(track => ({
          title: track.title,
          artist: track.artist,
          reason: `Features quintessential harmony and groove tailored for this mood.`,
          moodTags: ['curated', mood || 'chill', 'bitchord'],
          track,
        })),
        similarArtists: ['The Weeknd', 'Lofi Girl', 'Imagine Dragons', 'Alan Walker', 'BTS'],
        isFallback: true,
      });
    }
  });

  // Mount Vite middleware in development or static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BitChord Web Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
