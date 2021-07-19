import styles from './app.module.scss';
import { Navbar } from './components';
import LoginPage from './pages/login';

export function App() {
  return (
    <div className="container bg-green-50 min-h-screen min-w-full">
      <LoginPage />
    </div>
  );
}

export default App;
