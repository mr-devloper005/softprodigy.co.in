import type { TaskKey } from "@/lib/site-config";

export const slot4TaskSupport = {
  article: true,
  classified: false,
  sbm: false,
  profile: false,
  pdf: false,
  listing: true,
  image: false,
} satisfies Record<TaskKey, boolean>;

export const slot4TaskNotes = {
  article: "Stories & Guides shelf plus detail backlinks",
  classified: "Notice board pages plus detail backlinks",
  sbm: "Saved shelf pages plus detail backlinks",
  profile: "Profile pages",
  pdf: "Document library pages plus detail backlinks",
  listing: "Local Directory pages plus detail backlinks",
  image: "Visual feed pages plus detail backlinks",
} satisfies Record<TaskKey, string>;
