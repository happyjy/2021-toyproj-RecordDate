import { useSelector } from 'react-redux';
import { RootState } from '../Redux/modules/rootReducer';

export default function useToken() {
  const token = useSelector<RootState, string | null>(
    (state) => state.auth.token,
  );
  return token;
}
