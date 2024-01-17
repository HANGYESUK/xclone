import { auth } from '../firebase.ts';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const onLogOut = () => {
    auth.signOut().then(() => navigate('/login'));
  };
  return (
    <h1>
      <button onClick={onLogOut}>Log Out</button>
    </h1>
  );
}
