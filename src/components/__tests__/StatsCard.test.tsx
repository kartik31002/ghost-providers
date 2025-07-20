import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { StatsCard } from '../Dashboard/StatsCard';
import { theme } from '../../theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('StatsCard', () => {
  const defaultProps = {
    title: 'New Providers',
    value: 42,
    icon: <PersonAddIcon />,
    color: 'primary' as const,
  };

  it('renders title and value correctly', () => {
    renderWithTheme(<StatsCard {...defaultProps} />);
    
    expect(screen.getByText('New Providers')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows loading skeleton when loading prop is true', () => {
    renderWithTheme(<StatsCard {...defaultProps} loading={true} />);
    
    expect(screen.queryByText('New Providers')).not.toBeInTheDocument();
    expect(screen.queryByText('42')).not.toBeInTheDocument();
  });

  it('displays trend information when provided', () => {
    const trendProps = {
      ...defaultProps,
      trend: { value: 12.5, isPositive: true },
    };
    
    renderWithTheme(<StatsCard {...trendProps} />);
    
    expect(screen.getByText('12.5%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });
});