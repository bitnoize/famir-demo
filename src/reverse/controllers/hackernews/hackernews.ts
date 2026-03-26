export const HACKERNEWS_CONTROLLER = Symbol('HackernewsController')

export type HackernewsPayloadName =
  | 'hackernews_login'
  | 'hackernews_comment'
  | 'hackernews_xuser'
  | 'hackernews_xedit'
  | 'hackernews_xdelete'
  | 'hackernews_r'
  | 'hackernews_unknown'
  | 'hackernews_okey'
