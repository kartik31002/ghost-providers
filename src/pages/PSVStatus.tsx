import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { VerificationStatus } from '../types';

const psvSteps = [
  'License Verification',
  'DEA/NPI Check',
  'Education History',
  'Malpractice History',
  'Work History',
  'Sanctions Check',
];

export const PSVStatus: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();

  const { data: provider, isLoading } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => api.getProvider(providerId!),
    enabled: !!providerId,
  });

  if (isLoading) {
    return (
      <Box>
        <LinearProgress />
        <Box p={3}>
          <Typography>Loading PSV status...</Typography>
        </Box>
      </Box>
    );
  }

  if (!provider) {
    return (
      <Box p={3}>
        <Alert severity="error">Provider not found</Alert>
      </Box>
    );
  }

  const getStepStatus = (step: number): 'completed' | 'active' | 'pending' | 'error' => {
    const verifications = [
      provider.psvStatus.licenses,
      provider.psvStatus.deaNpi,
      provider.psvStatus.education,
      provider.psvStatus.malpractice,
      provider.psvStatus.workHistory,
      provider.psvStatus.sanctions,
    ];

    const verification = verifications[step];
    
    if (verification.status === 'verified') return 'completed';
    if (verification.status === 'failed') return 'error';
    if (verification.status === 'pending') return 'active';
    return 'pending';
  };

  const getActiveStep = (): number => {
    const verifications = [
      provider.psvStatus.licenses,
      provider.psvStatus.deaNpi,
      provider.psvStatus.education,
      provider.psvStatus.malpractice,
      provider.psvStatus.workHistory,
      provider.psvStatus.sanctions,
    ];

    const firstPendingIndex = verifications.findIndex(v => v.status === 'not-started' || v.status === 'pending');
    return firstPendingIndex === -1 ? verifications.length : firstPendingIndex;
  };

  const getOverallProgress = (): number => {
    const verifications = [
      provider.psvStatus.licenses,
      provider.psvStatus.deaNpi,
      provider.psvStatus.education,
      provider.psvStatus.malpractice,
      provider.psvStatus.workHistory,
      provider.psvStatus.sanctions,
    ];

    const completedCount = verifications.filter(v => v.status === 'verified').length;
    return (completedCount / verifications.length) * 100;
  };

  const getStatusIcon = (verification: VerificationStatus) => {
    switch (verification.status) {
      case 'verified':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'pending':
        return <ScheduleIcon color="warning" />;
      default:
        return <ScheduleIcon color="disabled" />;
    }
  };

  const getStatusColor = (status: VerificationStatus['status']) => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const verificationCards = [
    {
      title: 'License Status',
      verification: provider.psvStatus.licenses,
      description: 'State medical license verification',
    },
    {
      title: 'DEA/NPI Verification',
      verification: provider.psvStatus.deaNpi,
      description: 'DEA registration and NPI validation',
    },
    {
      title: 'Education History',
      verification: provider.psvStatus.education,
      description: 'Medical school and residency verification',
    },
    {
      title: 'Malpractice History',
      verification: provider.psvStatus.malpractice,
      description: 'Professional liability and claims history',
    },
    {
      title: 'Work History',
      verification: provider.psvStatus.workHistory,
      description: 'Employment and clinical experience verification',
    },
    {
      title: 'Sanctions Check',
      verification: provider.psvStatus.sanctions,
      description: 'OIG exclusion and sanctions screening',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <IconButton onClick={() => navigate(`/provider/${provider.id}`)}>
          <ArrowBackIcon />
        </IconButton>
        <Box flexGrow={1}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            Primary Source Verification
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {provider.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate(`/review/committee/${provider.id}`)}
        >
          Committee Review
        </Button>
      </Box>

      {/* Progress Overview */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justify="space-between" mb={2}>
          <Typography variant="h6">Overall Progress</Typography>
          <Typography variant="h6" color="primary">
            {Math.round(getOverallProgress())}% Complete
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={getOverallProgress()}
          sx={{ height: 8, borderRadius: 4, mb: 3 }}
        />
        
        <Stepper activeStep={getActiveStep()} alternativeLabel>
          {psvSteps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                error={getStepStatus(index) === 'error'}
                completed={getStepStatus(index) === 'completed'}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Verification Cards */}
      <Grid container spacing={3} mb={4}>
        {verificationCards.map((card, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardHeader
                title={card.title}
                subheader={card.description}
                avatar={getStatusIcon(card.verification)}
                action={
                  <Chip
                    label={card.verification.status.charAt(0).toUpperCase() + card.verification.status.slice(1)}
                    color={getStatusColor(card.verification.status)}
                    size="small"
                  />
                }
              />
              <CardContent>
                {card.verification.lastChecked && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last checked: {new Date(card.verification.lastChecked).toLocaleString()}
                  </Typography>
                )}
                {card.verification.source && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Source: {card.verification.source}
                  </Typography>
                )}
                {card.verification.notes && (
                  <Typography variant="body2" gutterBottom>
                    Notes: {card.verification.notes}
                  </Typography>
                )}
                
                <Box display="flex" gap={1} mt={2}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    disabled={card.verification.status === 'pending'}
                  >
                    Retry
                  </Button>
                  {card.verification.status === 'failed' && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                    >
                      Escalate
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Actions Section */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Outstanding Actions
        </Typography>
        
        <List>
          {provider.psvStatus.workHistory.status === 'pending' && (
            <ListItem>
              <ListItemIcon>
                <AssignmentIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Manual Review Required"
                secondary="Work history verification requires manual review by credentialing team"
              />
              <Button variant="outlined" size="small">
                Assign Reviewer
              </Button>
            </ListItem>
          )}
          
          {provider.psvStatus.licenses.status === 'failed' && (
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="error" />
              </ListItemIcon>
              <ListItemText
                primary="Provider Notification Needed"
                secondary="License verification failed - provider needs to submit updated documentation"
              />
              <Button variant="outlined" size="small" color="error">
                Notify Provider
              </Button>
            </ListItem>
          )}
        </List>

        {getOverallProgress() === 100 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>PSV Complete!</strong> All primary source verifications have been completed successfully. 
              This provider is ready for committee review.
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};