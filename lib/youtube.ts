const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

function isVideoId(value: string | undefined): value is string {
  return Boolean(value && VIDEO_ID.test(value));
}

export function youtubeVideoId(url: string): string | null {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean).at(0);
      return isVideoId(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const queryId = parsed.searchParams.get("v");
      if (queryId && isVideoId(queryId)) {
        return queryId;
      }
      const parts = parsed.pathname.split("/").filter(Boolean);
      const nested = parts.at(1);
      if (
        (parts.at(0) === "embed" || parts.at(0) === "shorts" || parts.at(0) === "live") &&
        isVideoId(nested)
      ) {
        return nested;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = youtubeVideoId(url);
  if (!id) {
    return null;
  }
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

export function isYouTubeUrl(url: string): boolean {
  return youtubeVideoId(url) !== null;
}
