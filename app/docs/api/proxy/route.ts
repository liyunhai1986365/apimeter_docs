export const runtime = 'nodejs';
export const revalidate = false;

export {
  DELETE,
  GET,
  HEAD,
  PATCH,
  POST,
  PUT,
  handle,
} from '@/app/api/proxy/route';
