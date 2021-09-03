import { useSelector } from 'react-redux';
import { RootState } from '../redux/Modules/rootReducer';

export default function useToken() {
  const token = useSelector<RootState, string | null>(
    (state) => state.auth.token,
  );
  return token;
}
