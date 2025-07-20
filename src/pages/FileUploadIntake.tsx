import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useAppStore } from '../store';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed' | 'validated';
  providersFound: number;
  validationErrors: string[];
  progress: number;
}

const steps = ['File Upload', 'Data Processing', 'Validation', 'Review & Import'];

export const FileUploadIntake: React.FC = () => {
  const { addNotification } = useAppStore();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || 
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          status: 'processing',
          providersFound: 0,
          validationErrors: [],
          progress: 0,
        };

        setUploadedFiles(prev => [...prev, newFile]);
        simulateFileProcessing(newFile.id);
        
        addNotification({
          message: `File "${file.name}" uploaded successfully`,
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false,
        });
      } else {
        addNotification({
          message: `File "${file.name}" is not a supported format. Please upload CSV or Excel files.`,
          type: 'error',
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    });
  };

  const simulateFileProcessing = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      setUploadedFiles(prev => prev.map(file => 
        file.id === fileId 
          ? { ...file, progress: Math.min(progress, 100) }
          : file
      ));

      if (progress >= 100) {
        clearInterval(interval);
        
        // Simulate processing completion
        setTimeout(() => {
          const providersFound = Math.floor(Math.random() * 50) + 10;
          const hasErrors = Math.random() > 0.7;
          
          setUploadedFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { 
                  ...file, 
                  status: hasErrors ? 'failed' : 'completed',
                  providersFound,
                  validationErrors: hasErrors ? [
                    'Missing NPI for 3 providers',
                    'Invalid email format for 2 providers',
                    'Duplicate entries found'
                  ] : [],
                  progress: 100
                }
              : file
          ));

          if (hasErrors) {
            addNotification({
              message: 'File processing completed with validation errors',
              type: 'warning',
              timestamp: new Date().toISOString(),
              read: false,
            });
          } else {
            addNotification({
              message: `File processed successfully. ${providersFound} providers found.`,
              type: 'success',
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
        }, 1000);
      }
    }, 500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    addNotification({
      message: 'File removed from upload queue',
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
    });
  };

  const handlePreviewFile = (file: UploadedFile) => {
    setSelectedFile(file);
    setPreviewDialogOpen(true);
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
      case 'validated':
        return 'success';
      case 'failed':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'completed':
      case 'validated':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'processing':
        return <WarningIcon color="warning" />;
      default:
        return <DescriptionIcon />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          File Upload Intake
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload CSV or Excel files containing provider information for batch processing
        </Typography>
      </Box>

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        {/* Upload Area */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="File Upload" />
            <CardContent>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: dragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: dragActive ? 'primary.50' : 'grey.50',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                  },
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drop files here or click to upload
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Supported formats: CSV, XLS, XLSX
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Maximum file size: 10MB
                </Typography>
                
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </Box>

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  size="small"
                >
                  Download Template
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DescriptionIcon />}
                  size="small"
                >
                  View Format Guide
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Uploaded Files Table */}
          <Card>
            <CardHeader
              title="Uploaded Files"
              subheader={`${uploadedFiles.length} files in processing queue`}
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>File Name</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Providers Found</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadedFiles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No files uploaded yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      uploadedFiles.map((file) => (
                        <TableRow key={file.id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              {getStatusIcon(file.status)}
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Uploaded {new Date(file.uploadedAt).toLocaleString()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatFileSize(file.size)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                              color={getStatusColor(file.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {file.status === 'processing' ? '-' : file.providersFound}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <LinearProgress
                                variant="determinate"
                                value={file.progress}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption">
                                {Math.round(file.progress)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handlePreviewFile(file)}
                              disabled={file.status === 'processing'}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteFile(file.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Processing Summary" />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CloudUploadIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Files Uploaded"
                    secondary={uploadedFiles.length}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Successfully Processed"
                    secondary={uploadedFiles.filter(f => f.status === 'completed').length}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Processing"
                    secondary={uploadedFiles.filter(f => f.status === 'processing').length}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <ErrorIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Failed"
                    secondary={uploadedFiles.filter(f => f.status === 'failed').length}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={uploadedFiles.filter(f => f.status === 'completed').length === 0}
                >
                  Import All Validated
                </Button>
                
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<RefreshIcon />}
                  disabled={uploadedFiles.filter(f => f.status === 'failed').length === 0}
                >
                  Retry Failed
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Upload Guidelines" />
            <CardContent>
              <Typography variant="body2" gutterBottom>
                <strong>Required Columns:</strong>
              </Typography>
              <Typography variant="caption" component="div" sx={{ mb: 2 }}>
                • First Name<br />
                • Last Name<br />
                • Email Address<br />
                • Phone Number<br />
                • Specialty
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Optional Columns:</strong>
              </Typography>
              <Typography variant="caption" component="div">
                • NPI Number<br />
                • TIN<br />
                • License Number<br />
                • DEA Number
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* File Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          File Processing Details: {selectedFile?.name}
        </DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedFile.status.charAt(0).toUpperCase() + selectedFile.status.slice(1)}
                    color={getStatusColor(selectedFile.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Providers Found</Typography>
                  <Typography variant="body1">{selectedFile.providersFound}</Typography>
                </Grid>
              </Grid>

              {selectedFile.validationErrors.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Validation Issues:</strong>
                  </Typography>
                  {selectedFile.validationErrors.map((error, index) => (
                    <Typography key={index} variant="body2">
                      • {error}
                    </Typography>
                  ))}
                </Alert>
              )}

              <Typography variant="body2" color="text.secondary" gutterBottom>
                Processing Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={selectedFile.progress}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <Typography variant="caption">
                {Math.round(selectedFile.progress)}% Complete
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>
            Close
          </Button>
          {selectedFile?.status === 'completed' && (
            <Button variant="contained">
              Import Providers
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};