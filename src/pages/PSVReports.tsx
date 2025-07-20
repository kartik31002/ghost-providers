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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  InputAdornment,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { StatsCard } from '../components/Dashboard/StatsCard';

interface PSVReport {
  id: string;
  providerName: string;
  npi: string;
  specialty: string;
  overallStatus: 'completed' | 'in-progress' | 'issues-found' | 'not-started';
  licenseStatus: 'verified' | 'pending' | 'failed';
  deaNpiStatus: 'verified' | 'pending' | 'failed';
  educationStatus: 'verified' | 'pending' | 'failed';
  malpracticeStatus: 'verified' | 'pending' | 'failed';
  workHistoryStatus: 'verified' | 'pending' | 'failed';
  sanctionsStatus: 'verified' | 'pending' | 'failed';
  lastUpdated: string;
  completionPercentage: number;
  issuesCount: number;
}

const mockReports: PSVReport[] = [
  {
    id: '1',
    providerName: 'Dr. John Smith',
    npi: '1234567890',
    specialty: 'Family Medicine',
    overallStatus: 'completed',
    licenseStatus: 'verified',
    deaNpiStatus: 'verified',
    educationStatus: 'verified',
    malpracticeStatus: 'verified',
    workHistoryStatus: 'verified',
    sanctionsStatus: 'verified',
    lastUpdated: '2024-01-16T14:22:00Z',
    completionPercentage: 100,
    issuesCount: 0,
  },
  {
    id: '2',
    providerName: 'Dr. Sarah Johnson',
    npi: '9876543210',
    specialty: 'Surgery',
    overallStatus: 'issues-found',
    licenseStatus: 'failed',
    deaNpiStatus: 'pending',
    educationStatus: 'verified',
    malpracticeStatus: 'verified',
    workHistoryStatus: 'pending',
    sanctionsStatus: 'verified',
    lastUpdated: '2024-01-15T11:30:00Z',
    completionPercentage: 67,
    issuesCount: 2,
  },
  {
    id: '3',
    providerName: 'Dr. Michael Chen',
    npi: '5555555555',
    specialty: 'Internal Medicine',
    overallStatus: 'in-progress',
    licenseStatus: 'verified',
    deaNpiStatus: 'verified',
    educationStatus: 'pending',
    malpracticeStatus: 'pending',
    workHistoryStatus: 'pending',
    sanctionsStatus: 'verified',
    lastUpdated: '2024-01-16T08:00:00Z',
    completionPercentage: 50,
    issuesCount: 0,
  },
];

export const PSVReports: React.FC = () => {
  const [reports] = useState<PSVReport[]>(mockReports);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, reportId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReportId(reportId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReportId(null);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.npi.includes(searchTerm) ||
                         report.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.overallStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return 'success';
      case 'failed':
      case 'issues-found':
        return 'error';
      case 'pending':
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'failed':
      case 'issues-found':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'pending':
      case 'in-progress':
        return <ScheduleIcon color="warning" fontSize="small" />;
      default:
        return <WarningIcon color="disabled" fontSize="small" />;
    }
  };

  const calculateStats = () => {
    const total = reports.length;
    const completed = reports.filter(r => r.overallStatus === 'completed').length;
    const inProgress = reports.filter(r => r.overallStatus === 'in-progress').length;
    const issues = reports.filter(r => r.overallStatus === 'issues-found').length;
    const avgCompletion = reports.reduce((sum, r) => sum + r.completionPercentage, 0) / total;

    return { total, completed, inProgress, issues, avgCompletion };
  };

  const stats = calculateStats();

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          PSV Reports & Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Primary Source Verification status and performance metrics
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total PSV Reports"
            value={stats.total}
            icon={<AssessmentIcon />}
            color="primary"
            trend={{ value: 15.2, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircleIcon />}
            color="success"
            trend={{ value: 8.7, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            icon={<ScheduleIcon />}
            color="warning"
            trend={{ value: 5.3, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Issues Found"
            value={stats.issues}
            icon={<ErrorIcon />}
            color="error"
            trend={{ value: 2.1, isPositive: false }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Reports Table */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="PSV Status Reports"
              subheader={`${filteredReports.length} of ${reports.length} reports`}
              action={
                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size="small"
                  >
                    Export
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    size="small"
                  >
                    Refresh
                  </Button>
                </Box>
              }
            />
            <CardContent>
              {/* Filters */}
              <Box display="flex" gap={2} mb={3}>
                <TextField
                  size="small"
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="issues-found">Issues Found</MenuItem>
                    <MenuItem value="not-started">Not Started</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Provider</TableCell>
                      <TableCell>Overall Status</TableCell>
                      <TableCell>Completion</TableCell>
                      <TableCell>Issues</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedReports.map((report) => (
                      <TableRow key={report.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {report.providerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              NPI: {report.npi} • {report.specialty}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            {getStatusIcon(report.overallStatus)}
                            <Chip
                              label={report.overallStatus.replace('-', ' ').toUpperCase()}
                              color={getStatusColor(report.overallStatus)}
                              size="small"
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LinearProgress
                              variant="determinate"
                              value={report.completionPercentage}
                              sx={{ width: 60, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="caption">
                              {report.completionPercentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {report.issuesCount > 0 ? (
                            <Chip
                              label={`${report.issuesCount} issues`}
                              color="error"
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              None
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(report.lastUpdated).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, report.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredReports.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Verification Metrics" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="License Verification"
                    secondary={`${reports.filter(r => r.licenseStatus === 'verified').length}/${reports.length} completed`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="DEA/NPI Verification"
                    secondary={`${reports.filter(r => r.deaNpiStatus === 'verified').length}/${reports.length} completed`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <ScheduleIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Education History"
                    secondary={`${reports.filter(r => r.educationStatus === 'verified').length}/${reports.length} completed`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Work History"
                    secondary={`${reports.filter(r => r.workHistoryStatus === 'verified').length}/${reports.length} completed`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardHeader title="Performance Trends" />
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Average Completion Time
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    12.5 days (↓ 2.3 days from last month)
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Issue Resolution Rate
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    87% (↓ 5% from last month)
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Overall Completion Rate
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.round(stats.avgCompletion)}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {Math.round(stats.avgCompletion)}% average completion
              </Typography>
            </CardContent>
          </Card>

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Automated PSV Checks:</strong> Next scheduled run in 6 hours. 
              All pending verifications will be processed automatically.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View Full Report
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Download PDF
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
          Refresh Status
        </MenuItem>
      </Menu>
    </Box>
  );
};