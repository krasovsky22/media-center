export type PlaylistType = {
  thumbnail: string;
  title: string;
};

export type ThumbnailType = {
  height: number;
  url: string;
  width: number;
};

export type YoutubePlaylistItem = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: ThumbnailType;
      high: ThumbnailType;
      maxres: ThumbnailType;
      defamediumult: ThumbnailType;
      standard: ThumbnailType;
    };
    resourceId: { kind: string; videoId: string };
    title: string;
    videoOwnerChannelTitle: string;
  };
  isFavorite?: boolean;
};

export type YoutubePlaylistType = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    localized: {
      title: string;
      description: string;
    };
    publishedAt: string;
    thumbnails: {
      default: ThumbnailType;
      high: ThumbnailType;
      maxres: ThumbnailType;
      defamediumult: ThumbnailType;
      standard: ThumbnailType;
    };
    title: string;
  };
};
