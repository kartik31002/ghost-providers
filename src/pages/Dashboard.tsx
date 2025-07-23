import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Typography,
  Alert,
  Icon,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  People as PeopleIcon,
  Autorenew as AutorenewIcon,
} from '@mui/icons-material';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { ValidationTable } from '../components/Dashboard/ValidationTable';
import { api } from '../services/api';
import { useAppStore } from '../store';
import { DashboardStats, Provider } from '../types';

export const Dashboard: React.FC = () => {
  const { setDashboardStats, setProviders } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<string[] | null>(null);

  const toggleFilter = (statuses: string[] | null) => {
    setStatusFilter((prev) =>
      JSON.stringify(prev) === JSON.stringify(statuses) ? null : statuses
    );
  };


  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
  });

  const { data: providers, isLoading: providersLoading } = useQuery<Provider[]>({
    queryKey: ['providers'],
    queryFn: api.getProviders,
  });

  useEffect(() => {
    if (stats) {
      setDashboardStats(stats);
    }
  }, [stats, setDashboardStats]);

  useEffect(() => {
    if (providers) {
      setProviders(providers);
    }
  }, [providers, setProviders]);

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Provider Intake Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor provider intake, validation status, and credentialing progress
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="New Providers"
            value={stats?.new || 0}
            icon={<PersonAddIcon />}
            color="primary"
            trend={{ value: 12.5, isPositive: true }}
            loading={statsLoading}
            onClick={() => toggleFilter(['New'])}
            active={JSON.stringify(statusFilter) === JSON.stringify(['New'])}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Application in Progress"
            value={
              (stats?.inProgress || 0) +
              (stats?.submitted || 0) +
              (stats?.psvInProgress || 0) +
              (stats?.pendingCommittee || 0)
            }
            icon={<AutorenewIcon />}
            color="warning"
            trend={{ value: 5.0, isPositive: true }}
            loading={statsLoading}
            onClick={() => toggleFilter([
              'Application Review in Progress',
              'Application Submitted',
              'PSV In Progress',
              'Committee Approval Pending',
            ])}
            active={JSON.stringify(statusFilter) === JSON.stringify([
              'Application Review in Progress',
              'Application Submitted',
              'PSV In Progress',
              'Committee Approval Pending',
            ])}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Provider Credentialed"
            value={stats?.credentialed || 0}
            icon={<CheckCircleIcon />}
            color="success"
            trend={{ value: 8.2, isPositive: true }}
            loading={statsLoading}
            onClick={() => toggleFilter(['Provider Credentialled'])}
            active={JSON.stringify(statusFilter) === JSON.stringify(['Provider Credentialled'])}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Application Failed"
            value={(stats?.psvFailed || 0) + (stats?.validationFailed || 0)}
            icon={<ErrorIcon />}
            color="error"
            trend={{ value: 3.1, isPositive: false }}
            loading={statsLoading}
            onClick={() => toggleFilter(['Application Validation Failed', 'PSV Failed'])}
            active={JSON.stringify(statusFilter) === JSON.stringify(['Application Validation Failed', 'PSV Failed'])}
          />
        </Grid>
      </Grid>

      {/* Recent Activity Alert */}
      {/* <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>System Update:</strong> PSV validation checks are now running automatically every 24 hours. 
          Next scheduled run: Today at 2:00 AM EST.
        </Typography>
      </Alert> */}

      {/* Providers Table */}
      <ValidationTable 
        providers={providers || []}
        loading={providersLoading}
        statusFilter={statusFilter}
      />
    </Box>
  );
};