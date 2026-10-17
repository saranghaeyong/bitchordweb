import json
import sys
from ytmusicapi import YTMusic

query = sys.argv[1].strip() if len(sys.argv) > 1 else ""
limit = max(1, min(int(sys.argv[2]) if len(sys.argv) > 2 else 10, 20))

if not query:
    print(json.dumps({"items": [], "source": "ytmusicapi"}))
    raise SystemExit(0)

try:
    results = YTMusic().search(query, filter="songs", limit=limit)
    items = []

    for track in results:
        video_id = track.get("videoId")
        if not video_id:
            continue

        artists = track.get("artists") or []
        artist = ", ".join(
            a.get("name", "") for a in artists if a.get("name")
        ) or "Unknown Artist"

        thumbnails = track.get("thumbnails") or []
        album = track.get("album") or {}

        items.append({
            "id": video_id,
            "title": track.get("title", "Unknown Title"),
            "artist": artist,
            "channelTitle": artist,
            "thumbnailUrl": thumbnails[-1].get("url") if thumbnails else None,
            "duration": track.get("duration_seconds") or 0,
            "durationFormatted": track.get("duration") or "",
            "views": track.get("views"),
            "album": album.get("name") if isinstance(album, dict) else None,
        })

    print(json.dumps({"items": items, "source": "ytmusicapi"}))
except Exception as exc:
    print(json.dumps({"error": str(exc)}), file=sys.stderr)
    raise SystemExit(1)
