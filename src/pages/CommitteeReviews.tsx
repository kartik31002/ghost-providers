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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  AvatarGroup,
  Tooltip,
} from '@mui/material';
import {
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../components/Dashboard/StatsCard';

interface CommitteeReview {
  id: string;
  providerName: string;
  npi: string;
  specialty: string;
  submittedDate: string;
  reviewStatus: 'pending' | 'in-review' | 'approved' | 'rejected' | 'deferred';
  assignedReviewers: string[];
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  psvStatus: 'completed' | 'in-progress' | 'issues-found';
  networkAdequacy: 'compliant' | 'non-compliant' | 'pending';
  lastActivity: string;
  comments: number;
}

const mockReviews: CommitteeReview[] = [
  {
    id: '1',
    providerName: 'Dr. John Smith',
    npi: '1234567890',
    specialty: 'Family Medicine',
    submittedDate: '2024-01-15T10:30:00Z',
    reviewStatus: 'pending',
    assignedReviewers: ['Dr. Wilson', 'Dr. Brown'],
    priority: 'high',
    dueDate: '2024-01-22T17:00:00Z',
    psvStatus: 'completed',
    networkAdequacy: 'compliant',
    lastActivity: '2024-01-16T14:22:00Z',
    comments: 3,
  },
  {
    id: '2',
    providerName: 'Dr. Sarah Johnson',
    npi: '9876543210',
    specialty: 'Surgery',
    submittedDate: '2024-01-14T15:45:00Z',
    reviewStatus: 'in-review',
    assignedReviewers: ['Dr. Davis', 'Dr. Miller', 'Dr. Taylor'],
    priority: 'medium',
    dueDate: '2024-01-21T17:00:00Z',
    psvStatus: 'issues-found',
    networkAdequacy: 'pending',
    lastActivity: '2024-01-16T11:15:00Z',
    comments: 7,
  },
  {
    id: '3',
    providerName: 'Dr. Michael Chen',
    npi: '5555555555',
    specialty: 'Internal Medicine',
    submittedDate: '2024-01-13T09:20:00Z',
    reviewStatus: 'approved',
    assignedReviewers: ['Dr. Wilson', 'Dr. Anderson'],
    priority: 'low',
    dueDate: '2024-01-20T17:00:00Z',
    psvStatus: 'completed',
    networkAdequacy: 'compliant',
    lastActivity: '2024-01-16T16:30:00Z',
    comments: 2,
  },
];

export const CommitteeReviews: React.FC = () => {
  const navigate = useNavigate();
  const [reviews] = useState<CommitteeReview[]>(mockReviews);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, reviewId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReviewId(reviewId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReviewId(null);
  };

  const handleViewReview = () => {
    if (selectedReviewId) {
      navigate(`/review/committee/${selectedReviewId}`);
    }
    handleMenuClose();
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.npi.includes(searchTerm) ||
                         review.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.reviewStatus === statusFilter;
    const matchesPriority = priorityFilter === 'all' || review.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const paginatedReviews = filteredReviews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status: CommitteeReview['reviewStatus']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'in-review':
        return 'warning';
      case 'deferred':
        return 'info';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: CommitteeReview['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const calculateStats = () => {
    const total = reviews.length;
    const pending = reviews.filter(r => r.reviewStatus === 'pending').length;
    const inReview = reviews.filter(r => r.reviewStatus === 'in-review').length;
    const approved = reviews.filter(r => r.reviewStatus === 'approved').length;
    const avgDaysToReview = 5.2; // Mock calculation

    return { total, pending, inReview, approved, avgDaysToReview };
  };

  const stats = calculateStats();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Committee Reviews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Credentialing committee review queue and approval workflow
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Reviews"
            value={stats.total}
            icon={<AssignmentIcon />}
            color="primary"
            trend={{ value: 12.5, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={<ScheduleIcon />}
            color="warning"
            trend={{ value: 8.2, isPositive: false }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="In Review"
            value={stats.inReview}
            icon={<GroupIcon />}
            color="primary"
            trend={{ value: 3.1, isPositive: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={<CheckCircleIcon />}
            color="success"
            trend={{ value: 15.7, isPositive: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Main Reviews Table */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Committee Review Queue"
              subheader={`${filteredReviews.length} of ${reviews.length} reviews`}
              action={
                <Button
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  size="small"
                >
                  Schedule Meeting
                </Button>
              }
            />
            <CardContent>
              {/* Filters */}
              <Box display="flex" gap={2} mb={3} flexWrap="wrap">
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
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-review">In Review</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                    <MenuItem value="deferred">Deferred</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    label="Priority"
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Priority</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Provider</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Reviewers</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedReviews.map((review) => (
                      <TableRow key={review.id} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {review.providerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              NPI: {review.npi} • {review.specialty}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={review.reviewStatus.replace('-', ' ').toUpperCase()}
                            color={getStatusColor(review.reviewStatus)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={review.priority.toUpperCase()}
                            color={getPriorityColor(review.priority)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                            {review.assignedReviewers.map((reviewer, index) => (
                              <Tooltip key={index} title={reviewer}>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                                  {getInitials(reviewer)}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography 
                              variant="body2" 
                              color={isOverdue(review.dueDate) ? 'error' : 'text.primary'}
                              fontWeight={isOverdue(review.dueDate) ? 600 : 400}
                            >
                              {new Date(review.dueDate).toLocaleDateString()}
                            </Typography>
                            {isOverdue(review.dueDate) && (
                              <Typography variant="caption" color="error">
                                Overdue
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, review.id)}
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
                count={filteredReviews.length}
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

        {/* Committee Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Committee Members" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Dr. Wilson (Chair)"
                    secondary="Active • 5 pending reviews"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Dr. Brown"
                    secondary="Active • 3 pending reviews"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Dr. Davis"
                    secondary="Active • 2 pending reviews"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Dr. Miller"
                    secondary="Away • Returns Jan 20"
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<EmailIcon />}
                size="small"
              >
                Notify Committee
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardHeader title="Upcoming Meetings" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Weekly Committee Meeting"
                    secondary="Tomorrow, 2:00 PM EST"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TimeIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Emergency Review Session"
                    secondary="Jan 20, 10:00 AM EST"
                  />
                </ListItem>
              </List>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CalendarIcon />}
                size="small"
                sx={{ mt: 2 }}
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>

          <Alert severity="warning">
            <Typography variant="body2">
              <strong>3 reviews</strong> are overdue and require immediate attention. 
              Consider scheduling an emergency committee session.
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
        <MenuItem onClick={handleViewReview}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Open Review
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Assign Reviewer
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          Send Reminder
        </MenuItem>
      </Menu>
    </Box>
  );
};