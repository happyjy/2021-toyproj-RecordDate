import { useSelector } from 'react-redux';

import { RootState } from '../redux/modules/rootReducer';

export default function useProfileUrl() {
  const [profileUrl, numnailUrl] = useSelector<
    RootState,
    [string | null, string | null]
  >((state) => [state.auth.profileImageUrl, state.auth.thumbnailImageUrl]);
  return [profileUrl, numnailUrl];
}
