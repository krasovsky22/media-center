import { withAuthenticator } from 'aws-amplify-react';
import React from 'react';
import { Navbar } from '../components';

const DashboardPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <div className="container">Container here</div>
      </main>
    </>
  );
};

export default DashboardPage;
