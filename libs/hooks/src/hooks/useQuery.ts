import { useLocation } from 'react-router-dom';

export default function useQuery(parameter?: string) {
  const params = new URLSearchParams(useLocation().search);

  return parameter ? params.get(parameter) : params;
}
