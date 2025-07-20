import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  ContactPhone as ContactPhoneIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import { Provider } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

export const ProviderProfile: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

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
          <Typography>Loading provider details...</Typography>
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

  const getStatusColor = (status: Provider['status']) => {
    switch (status) {
      case 'validated':
      case 'approved':
        return 'success';
      case 'failed':
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getValidationProgress = () => {
    const sections = [
      { key: 'demographics', valid: !!provider.demographics.dateOfBirth },
      { key: 'contact', valid: provider.contact.address.isValidated },
      { key: 'credentials', valid: !!provider.npi },
      { key: 'licenses', valid: provider.credentials.stateLicenses.length > 0 },
    ];
    
    const validCount = sections.filter(s => s.valid).length;
    return (validCount / sections.length) * 100;
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <IconButton onClick={() => navigate('/dashboard/intake')}>
          <ArrowBackIcon />
        </IconButton>
        <Box flexGrow={1}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            {provider.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
              color={getStatusColor(provider.status)}
              variant="filled"
            />
            <Typography variant="body2" color="text.secondary">
              Intake Source: {provider.intakeSource}
            </Typography>
            {provider.npi && (
              <Typography variant="body2" color="text.secondary">
                NPI: {provider.npi}
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate(`/psv/${provider.id}`)}
        >
          View PSV Status
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Demographics" />
              <Tab label="Contact & Address" />
              <Tab label="Credentials" />
              <Tab label="Documents" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>Personal Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Full Name"
                        secondary={`${provider.firstName} ${provider.lastName}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Date of Birth"
                        secondary={provider.demographics.dateOfBirth || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Gender"
                        secondary={provider.demographics.gender || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="SSN"
                        secondary={provider.demographics.ssn || 'Not provided'}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Address</Typography>
                  <Card variant="outlined">
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="body1" flexGrow={1}>
                          {provider.contact.address.street}<br />
                          {provider.contact.address.city}, {provider.contact.address.state} {provider.contact.address.zipCode}
                        </Typography>
                        {provider.contact.address.isValidated ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <ErrorIcon color="error" />
                        )}
                      </Box>
                      <Chip
                        label={provider.contact.address.isValidated ? 'USPS Validated' : 'Validation Failed'}
                        color={provider.contact.address.isValidated ? 'success' : 'error'}
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Email"
                        secondary={provider.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={provider.phone}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Identifiers</Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="NPI"
                        secondary={provider.npi || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="TIN"
                        secondary={provider.tin || 'Not provided'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="DEA Number"
                        secondary={provider.credentials.deaNumber || 'Not provided'}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Licenses</Typography>
                  {provider.credentials.stateLicenses.map((license) => (
                    <Card key={license.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" justify="space-between">
                          <Box>
                            <Typography variant="body1" fontWeight={600}>
                              {license.state} License
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {license.licenseNumber}
                            </Typography>
                            <Typography variant="caption">
                              Expires: {license.expirationDate}
                            </Typography>
                          </Box>
                          <Chip
                            label={license.status}
                            color={license.status === 'active' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box textAlign="center" py={4}>
                <UploadIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Document Upload</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Upload required documents for verification
                </Typography>
                <Button variant="outlined" startIcon={<UploadIcon />}>
                  Upload Documents
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Validation Status Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Validation Status"
              subheader={`${Math.round(getValidationProgress())}% Complete`}
            />
            <CardContent>
              <LinearProgress
                variant="determinate"
                value={getValidationProgress()}
                sx={{ mb: 3, height: 8, borderRadius: 4 }}
              />
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    {provider.demographics.dateOfBirth ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Demographics" />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {provider.contact.address.isValidated ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Address Validation" />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {provider.npi ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="NPI Verification" />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    {provider.credentials.stateLicenses.length > 0 ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="License Verification" />
                </ListItem>
              </List>

              {provider.validationErrors.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="error">
                    Validation Issues
                  </Typography>
                  {provider.validationErrors.map((error, index) => (
                    <Alert
                      key={index}
                      severity={error.severity}
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">
                        <strong>{error.field}:</strong> {error.message}
                      </Typography>
                    </Alert>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};