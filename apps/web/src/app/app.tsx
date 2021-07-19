import { AuthProvider } from './context/auth';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export function App() {
  return (
    <AuthProvider>
      <div className="container bg-green-50 min-h-screen min-w-full">
        <Router>
          <Switch>
            <Route exact path="/">
              <LoginPage />
            </Route>
            <Route path="/dashboard">
              <DashboardPage />
            </Route>
          </Switch>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
