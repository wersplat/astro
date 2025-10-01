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
  sort?: string;
  page?: string;
};

export default function CrewsFilters({ searchParams }: { searchParams: SearchParamsType }) {
  const [filters, setFilters] = useState({
    search: searchParams.search || '',
    sort: searchParams.sort || 'name-asc'
  });

  const sortOptions = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'name-asc') {
        params.set(key, value);
      }
    });
    
    window.location.href = `/crews?${params.toString()}`;
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      sort: 'name-asc'
    });
    window.location.href = '/crews';
  };

  const hasActiveFilters = filters.search || filters.sort !== 'name-asc';

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Crews"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search by crew name..."
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
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
