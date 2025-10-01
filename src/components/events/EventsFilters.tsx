'use client';
import { useState } from 'react';
import { 
  Paper, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button,
  Box
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

type SearchParamsType = {
  search?: string;
  tier?: string;
  status?: string;
  sort?: string;
  page?: string;
};

export default function EventsFilters({ searchParams }: { searchParams: SearchParamsType }) {
  const [filters, setFilters] = useState({
    search: searchParams.search || '',
    tier: searchParams.tier || '',
    sort: searchParams.sort || 'date-desc'
  });

  const tierOptions = [
    { value: '', label: 'All Tiers' },
    { value: '1', label: 'T1 - Major LANs' },
    { value: '2', label: 'T2 - Franchise' },
    { value: '3', label: 'T3 - Qualifiers' },
    { value: '4', label: 'T4 - Invitationals' },
    { value: '5', label: 'T5 - Community' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'rp-desc', label: 'Highest RP Prize' },
    { value: 'name-asc', label: 'Name A-Z' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && !(key === 'sort' && value === 'date-desc')) {
        params.set(key, value);
      }
    });
    
    window.location.href = `/events?${params.toString()}`;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tier: '',
      sort: 'date-desc'
    });
    window.location.href = '/events';
  };

  const hasActiveFilters = filters.search || filters.tier || filters.sort !== 'date-desc';

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search Events"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by event name..."
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Tier</InputLabel>
            <Select
              value={filters.tier}
              label="Tier"
              onChange={(e) => handleFilterChange('tier', e.target.value)}
            >
              {tierOptions.map(tier => (
                <MenuItem key={tier.value} value={tier.value}>
                  {tier.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sort}
              label="Sort By"
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={applyFilters}
              sx={{ flex: 1 }}
            >
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                onClick={clearFilters}
                startIcon={<Clear />}
              >
                Clear
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
