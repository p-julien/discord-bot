import { Submission as RedditSubmission } from 'snoowrap';

type GalleryData = {
  items: any[];
};

export type Submission = RedditSubmission & {
  is_gallery: boolean;
  media_metadata: any[];
  gallery_data: GalleryData;
};
