import { AuthProvider } from './context/auth';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';

export function App() {
  return (
    <AuthProvider>
      <div className="container bg-green-50 min-h-screen min-w-full">
        <LoginPage />
        <DashboardPage />
      </div>
    </AuthProvider>
  );
}

export default App;
