import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { ValidationTable } from '../components/Dashboard/ValidationTable';
import { api } from '../services/api';
import { useAppStore } from '../store';

export const Dashboard: React.FC = () => {
  const { setDashboardStats, setProviders } = useAppStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.getDashboardStats,
    onSuccess: (data) => setDashboardStats(data),
  });

  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: api.getProviders,
    onSuccess: (data) => setProviders(data),
  });

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
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Validated"
            value={stats?.validated || 0}
            icon={<CheckCircleIcon />}
            color="success"
            trend={{ value: 8.2, isPositive: true }}
            loading={statsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Failed Validation"
            value={stats?.failed || 0}
            icon={<ErrorIcon />}
            color="error"
            trend={{ value: 3.1, isPositive: false }}
            loading={statsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Providers"
            value={stats?.totalProviders || 0}
            icon={<PeopleIcon />}
            color="secondary"
            loading={statsLoading}
          />
        </Grid>
      </Grid>

      {/* Recent Activity Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>System Update:</strong> PSV validation checks are now running automatically every 24 hours. 
          Next scheduled run: Today at 2:00 AM EST.
        </Typography>
      </Alert>

      {/* Providers Table */}
      <ValidationTable 
        providers={providers} 
        loading={providersLoading}
      />
    </Box>
  );
};