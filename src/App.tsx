import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ProviderProfile } from './pages/ProviderProfile';
import { PSVStatus } from './pages/PSVStatus';
import { CommitteeReview } from './pages/CommitteeReview';
import { RosterIntake } from './pages/RosterIntake';
import { FileUploadIntake } from './pages/FileUploadIntake';
import { PSVReports } from './pages/PSVReports';
import { CommitteeReviews } from './pages/CommitteeReviews';
import { theme } from './theme';
import { queryClient } from './services/api';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router basename="/ghost-providers"> {/* Add this basename */}
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard/intake" replace />} />
              <Route path="dashboard/intake" element={<Dashboard />} />
              <Route path="provider/:providerId" element={<ProviderProfile />} />
              <Route path="psv/:providerId" element={<PSVStatus />} />
              <Route path="review/committee/:providerId" element={<CommitteeReview />} />
              
              {/* Placeholder routes for sidebar navigation */}
              <Route path="intake/roster" element={<RosterIntake />} />
              <Route path="intake/upload" element={<FileUploadIntake />} />
              <Route path="reports/psv" element={<PSVReports />} />
              <Route path="reviews" element={<CommitteeReviews />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;