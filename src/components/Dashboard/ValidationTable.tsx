import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
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
  Box,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Provider } from '../../types';

interface ValidationTableProps {
  providers: Provider[];
  loading?: boolean;
  statusFilter?: string[] | null;
}

export const ValidationTable: React.FC<ValidationTableProps> = ({
  providers,
  loading = false,
  statusFilter = null,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, providerId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProviderId(providerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProviderId(null);
  };

  const handleViewProvider = () => {
    if (selectedProviderId) {
      navigate(`/provider/${selectedProviderId}`);
    }
    handleMenuClose();
  };

  const handleEditProvider = () => {
    if (selectedProviderId) {
      navigate(`/provider/${selectedProviderId}/edit`);
    }
    handleMenuClose();
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.npi?.includes(searchTerm);

    const matchesStatus = statusFilter ? statusFilter.includes(provider.status) : true;

    return matchesSearch && matchesStatus;
  });


  const paginatedProviders = filteredProviders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status: Provider['status']) => {
    switch (status) {
      case 'Provider Credentialled':
        return 'success';
      case 'New':
        return 'primary';
      case 'Application Review in Progress':
      case 'Application Submitted':
      case 'PSV In Progress':
      case 'Committee Approval Pending':
        return 'warning';
      case 'Application Validation Failed':
      case 'PSV Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getIntakeSourceLabel = (source: Provider['intakeSource']) => {
    switch (source) {
      case 'manual':
        return 'Manual Entry';
      case 'file-upload':
        return 'File Upload';
      case 'api':
        return 'API Integration';
      default:
        return source;
    }
  };

  return (
    <Card>
      <CardHeader
        title="Provider Validation Results"
        subheader="Recent provider intake and validation status"
        action={
          <Box sx={{ width: 300 }}>
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
              fullWidth
            />
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Provider Name</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Intake Source</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Loading...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      No providers found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProviders.map((provider) => (
                  <TableRow
                    key={provider.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {provider.name}
                        </Typography>
                        {provider.npi && (
                          <Typography variant="caption" color="text.secondary">
                            NPI: {provider.npi}
                          </Typography>
                        )}
                      </Box>
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
                        {getIntakeSourceLabel(provider.intakeSource)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                        color={getStatusColor(provider.status)}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(provider.updatedAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, provider.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredProviders.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleViewProvider}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleEditProvider}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Provider
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};