import React, { useState } from 'react';
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
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Alert,
  Divider,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  PictureAsPdf as PdfIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

export const CommitteeReview: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<'approve' | 'reject' | 'request-info' | ''>('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: provider, isLoading } = useQuery({
    queryKey: ['provider', providerId],
    queryFn: () => api.getProvider(providerId!),
    enabled: !!providerId,
  });

  const handleSubmitReview = async () => {
    if (!decision || !providerId) return;
    
    setSubmitting(true);
    try {
      await api.submitReview(providerId, decision, comments);
      // Show success message and navigate
      navigate('/dashboard/intake');
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box>
        <LinearProgress />
        <Box p={3}>
          <Typography>Loading provider for review...</Typography>
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

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approve':
        return 'success';
      case 'reject':
        return 'error';
      case 'request-info':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/dashboard/intake')}
        >
          Dashboard
        </Link>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate(`/provider/${provider.id}`)}
        >
          {provider.name}
        </Link>
        <Typography variant="body2" color="text.primary">
          Committee Review
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <IconButton onClick={() => navigate(`/psv/${provider.id}`)}>
          <ArrowBackIcon />
        </IconButton>
        <Box flexGrow={1}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            Credentialing Committee Review
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" color="text.secondary">
              {provider.name}
            </Typography>
            <Chip
              label={`NPI: ${provider.npi}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Panel - Provider Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3 }}>
            <CardHeader
              title="Provider Summary Report"
              subheader="Complete credentialing package for committee review"
              action={
                <Button
                  variant="outlined"
                  startIcon={<PdfIcon />}
                  size="small"
                >
                  View Full PDF
                </Button>
              }
            />
            <CardContent>
              {/* PDF Viewer Placeholder */}
              <Box
                sx={{
                  height: 400,
                  backgroundColor: 'grey.100',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <PdfIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                  Provider Credentialing Summary
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PDF document would be embedded here
                </Typography>
                <Button variant="contained" startIcon={<PdfIcon />}>
                  Open Full Document
                </Button>
              </Box>
            </CardContent>
          </Paper>

          {/* Network Adequacy Section */}
          <Card>
            <CardHeader
              title="Network Adequacy Intelligence"
              subheader="Geographic coverage and utilization analysis"
              avatar={<MapIcon color="primary" />}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Coverage Metrics</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Service Area Coverage"
                        secondary="95% of target zip codes within 30 miles"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Specialty Gap Analysis"
                        secondary="Fills critical need in Family Medicine"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Patient Access Impact"
                        secondary="Reduces average wait time by 12 days"
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Utilization Flags</Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Chip label="High Patient Demand Area" color="success" size="small" />
                    <Chip label="Network Adequacy Compliant" color="success" size="small" />
                    <Chip label="Quality Metrics: Above Average" color="success" size="small" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Review Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Review Decision" />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Decision</InputLabel>
                <Select
                  value={decision}
                  label="Decision"
                  onChange={(e) => setDecision(e.target.value as any)}
                >
                  <MenuItem value="approve">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      Approve
                    </Box>
                  </MenuItem>
                  <MenuItem value="reject">
                    <Box display="flex" alignItems="center" gap={1}>
                      <CancelIcon color="error" fontSize="small" />
                      Reject
                    </Box>
                  </MenuItem>
                  <MenuItem value="request-info">
                    <Box display="flex" alignItems="center" gap={1}>
                      <InfoIcon color="warning" fontSize="small" />
                      Request More Info
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Committee Comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter detailed comments for the credentialing decision..."
                sx={{ mb: 3 }}
              />

              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmitReview}
                  disabled={!decision || submitting}
                  color={getDecisionColor(decision)}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<EmailIcon />}
                >
                  Email Final PDF
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShareIcon />}
                >
                  Send to External Committee
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Provider Info */}
          <Card>
            <CardHeader title="Provider Quick Info" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Specialty"
                    secondary={provider.credentials.specialties[0]?.description || 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="License State"
                    secondary={provider.credentials.stateLicenses[0]?.state || 'Not provided'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Application Date"
                    secondary={new Date(provider.createdAt).toLocaleDateString()}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="PSV Status"
                    secondary={
                      <Chip
                        label={provider.psvStatus.overallStatus.replace('-', ' ').toUpperCase()}
                        size="small"
                        color={provider.psvStatus.overallStatus === 'completed' ? 'success' : 'warning'}
                      />
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};