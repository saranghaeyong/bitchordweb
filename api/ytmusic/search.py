import json
import sys
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

from ytmusicapi import YTMusic


def json_response(handler, status, payload):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Cache-Control", "no-store")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        params = parse_qs(urlparse(self.path).query)
        query = (params.get("q", [""])[0] or "").strip()

        if not query:
            json_response(self, 400, {"error": "Provide a search query using ?q="})
            return

        try:
            limit = int(params.get("limit", ["10"])[0])
        except (TypeError, ValueError):
            limit = 10
        limit = max(1, min(limit, 20))

        try:
            results = YTMusic().search(query, filter="songs", limit=limit)
            items = []

            for track in results:
                video_id = track.get("videoId")
                if not video_id:
                    continue

                artists = track.get("artists") or []
                artist = ", ".join(
                    artist_item.get("name", "")
                    for artist_item in artists
                    if artist_item.get("name")
                ) or "Unknown Artist"

                thumbnails = track.get("thumbnails") or []
                album = track.get("album") or {}

                items.append({
                    "id": video_id,
                    "title": track.get("title", "Unknown Title"),
                    "artist": artist,
                    "channelTitle": artist,
                    "thumbnailUrl": thumbnails[-1].get("url") if thumbnails else "",
                    "duration": track.get("duration_seconds") or 0,
                    "durationFormatted": track.get("duration") or "",
                    "views": track.get("views"),
                    "album": album.get("name") if isinstance(album, dict) else None,
                })

            json_response(self, 200, {"items": items, "source": "ytmusicapi"})
        except Exception as exc:
            print(f"YouTube Music search failed: {exc}", file=sys.stderr)
            json_response(self, 502, {
                "error": "YouTube Music search failed. Please try again shortly."
            })

    def log_message(self, format_string, *args):
        # Keep routine requests out of function logs.
        return
