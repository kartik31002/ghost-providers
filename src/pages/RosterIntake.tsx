import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useAppStore } from '../store';

interface RosterProvider {
  id: string;
  roId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  npi?: string;
  specialty: string;
  status: 'draft' | 'submitted' | 'validated' | 'failed';
  validationErrors: string[];
}

const steps = ['Provider Information', 'Credentials', 'Review & Submit'];

export const RosterIntake: React.FC = () => {
  const { addNotification } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [rosterProviders, setRosterProviders] = useState<RosterProvider[]>([
    {
      id: '1',
      roId: 'RO-1001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      npi: '1234567890',
      specialty: 'Family Medicine',
      status: 'draft',
      validationErrors: [],
    },
    {
      id: '2',
      roId: 'RO-1002',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '(555) 987-6543',
      npi: '9876543210',
      specialty: 'Pediatrics',
      status: 'submitted',
      validationErrors: [],
    },
    {
      id: '3',
      roId: 'RO-1003',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@email.com',
      phone: '(555) 555-1212',
      npi: '',
      specialty: 'Surgery',
      status: 'validated',
      validationErrors: [],
    },
    {
      id: '4',
      roId: 'RO-1004',
      firstName: 'Emily',
      lastName: 'White',
      email: 'emily.white@email.com',
      phone: '(555) 555-1313',
      npi: '2233445566',
      specialty: 'Cardiology',
      status: 'failed',
      validationErrors: ['NPI missing'],
    },
  ]);
  const [selectedProvider, setSelectedProvider] = useState<RosterProvider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    npi: '',
    specialty: '',
    roId: '',
  });

  // const handleAddProvider = () => {
  //   setSelectedProvider(null);
  //   setFormData({
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     phone: '',
  //     npi: '',
  //     specialty: '',
  //   });
  //   setDialogOpen(true);
  // };

  const handleEditProvider = (provider: RosterProvider) => {
    setSelectedProvider(provider);
    setFormData({
      firstName: provider.firstName,
      lastName: provider.lastName,
      email: provider.email,
      phone: provider.phone,
      npi: provider.npi || '',
      specialty: provider.specialty,
      roId: provider.roId,
    });
    setDialogOpen(true);
  };

  const handleSaveProvider = () => {
    const newProvider: RosterProvider = {
      id: selectedProvider?.id || Date.now().toString(),
      ...formData,
      status: 'draft',
      validationErrors: [],
    };

    if (selectedProvider) {
      setRosterProviders(prev => 
        prev.map(p => p.id === selectedProvider.id ? newProvider : p)
      );
      addNotification({
        message: 'Provider updated successfully',
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false,
      });
    } else {
      setRosterProviders(prev => [...prev, newProvider]);
      addNotification({
        message: 'Provider added to roster',
        type: 'success',
        timestamp: new Date().toISOString(),
        read: false,
      });
    }

    setDialogOpen(false);
  };

  const handleDeleteProvider = (id: string) => {
    setRosterProviders(prev => prev.filter(p => p.id !== id));
    addNotification({
      message: 'Provider removed from roster',
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
    });
  };

  // const handleSubmitRoster = () => {
  //   const updatedProviders = rosterProviders.map(provider => ({
  //     ...provider,
  //     status: 'submitted' as const,
  //   }));
  //   setRosterProviders(updatedProviders);
    
  //   addNotification({
  //     message: `${rosterProviders.length} providers submitted for validation`,
  //     type: 'success',
  //     timestamp: new Date().toISOString(),
  //     read: false,
  //   });
  // };

  const getStatusColor = (status: RosterProvider['status']) => {
    switch (status) {
      case 'validated':
        return 'success';
      case 'failed':
        return 'error';
      case 'submitted':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Roster Auotmation Intake 
        </Typography>
        <Typography variant="body1" color="text.secondary">
        Records routed via roster automation for credentailling 
        </Typography>
      </Box>

      {/* Progress Stepper */}
      {/* <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper> */}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Providers"
              subheader={`${rosterProviders.length} providers from roster automation`}
              // action={
              //   <Button
              //     variant="contained"
              //     startIcon={<AddIcon />}
              //     onClick={handleAddProvider}
              //   >
              //     Add Provider
              //   </Button>
              // }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>RO-ID</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>NPI</TableCell>
                      <TableCell>Specialty</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rosterProviders
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((provider) => (
                        <TableRow key={provider.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {provider.firstName} {provider.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {provider.roId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2">{provider.email}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {provider.phone}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {provider.npi || 'Not provided'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{provider.specialty}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                              color={getStatusColor(provider.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleEditProvider(provider)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProvider(provider.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={rosterProviders.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Actions Panel */}
        <Grid item xs={12} md={4}>
          {/* <Card sx={{ mb: 3 }}>
            <CardHeader title="Roster Actions" />
            <CardContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<UploadIcon />}
                  onClick={handleSubmitRoster}
                  disabled={rosterProviders.length === 0}
                >
                  Submit Roster for Validation
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SaveIcon />}
                  disabled={rosterProviders.length === 0}
                >
                  Save as Draft
                </Button>
                
                <Divider />
                
                <Typography variant="body2" color="text.secondary">
                  Bulk Actions
                </Typography>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                >
                  Import from CSV
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  disabled={rosterProviders.length === 0}
                >
                  Export Roster
                </Button>
              </Box>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader title="Validation Summary" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonAddIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Providers"
                    secondary={rosterProviders.length}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ready for Submission"
                    secondary={rosterProviders.filter(p => p.status === 'draft').length}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pending Validation"
                    secondary={rosterProviders.filter(p => p.status === 'submitted').length}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Provider Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProvider ? 'Edit Provider' : 'Add New Provider'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="RO-ID"
                value={formData.roId}
                onChange={(e) => setFormData(prev => ({ ...prev, roId: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="NPI Number"
                value={formData.npi}
                onChange={(e) => setFormData(prev => ({ ...prev, npi: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={formData.specialty}
                  label="Specialty"
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                >
                  <MenuItem value="Family Medicine">Family Medicine</MenuItem>
                  <MenuItem value="Internal Medicine">Internal Medicine</MenuItem>
                  <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                  <MenuItem value="Surgery">Surgery</MenuItem>
                  <MenuItem value="Cardiology">Cardiology</MenuItem>
                  <MenuItem value="Neurology">Neurology</MenuItem>
                  <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                  <MenuItem value="Emergency Medicine">Emergency Medicine</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveProvider}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.specialty}
          >
            {selectedProvider ? 'Update' : 'Add'} Provider
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};