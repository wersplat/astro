'use client';

import { useState, useCallback } from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  IconButton, 
  InputAdornment,
  Chip,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Search as SearchIcon, GridView as GridViewIcon, ViewList as ViewListIcon } from '@mui/icons-material';

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'scoring', label: '🏀 Scoring' },
  { value: 'assists', label: '🎯 Assists' },
  { value: 'defense', label: '🛡️ Defense' },
  { value: 'rebounding', label: '🪣 Rebounding' },
  { value: 'mixed', label: '📊 Mixed Stats' },
  { value: 'streak', label: '🔥 Streak & Longevity' },
  { value: 'legendary', label: '🌟 Legendary' }
];

const rarityOptions = [
  { value: '', label: 'All Rarities' },
  { value: 'common', label: 'Common' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' }
];

type SearchParamsType = {
  search?: string;
  category?: string;
  rarity?: string;
  view?: string;
};

export default function AchievementsFilters({ searchParams }: { searchParams: SearchParamsType }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [filters, setFilters] = useState<SearchParamsType>({
    search: searchParams.search || '',
    category: searchParams.category || '',
    rarity: searchParams.rarity || '',
    view: searchParams.view || 'grid'
  });

  const updateFilters = useCallback((newFilters: Partial<SearchParamsType>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      }
    });

    window.location.href = `/achievements?${params.toString()}`;
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      rarity: '',
      view: 'grid'
    });
    window.location.href = '/achievements';
  };

  const hasActiveFilters = filters.search || filters.category || filters.rarity;

  return (
    <Box sx={{ mb: 4 }}>
      <Stack 
        direction={isMobile ? 'column' : 'row'} 
        spacing={2} 
        alignItems={isMobile ? 'stretch' : 'center'}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={2} 
          sx={{ flexGrow: 1 }}
        >
          {/* Search */}
          <TextField
            placeholder="Search achievements..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Category Filter */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              label="Category"
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Rarity Filter */}
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Rarity</InputLabel>
            <Select
              value={filters.rarity}
              onChange={(e) => updateFilters({ rarity: e.target.value })}
              label="Rarity"
            >
              {rarityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* View Toggle */}
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => updateFilters({ view: 'grid' })}
            color={filters.view === 'grid' ? 'primary' : 'default'}
            size="small"
            title="Grid View"
          >
            <GridViewIcon />
          </IconButton>
          <IconButton
            onClick={() => updateFilters({ view: 'list' })}
            color={filters.view === 'list' ? 'primary' : 'default'}
            size="small"
            title="List View"
          >
            <ViewListIcon />
          </IconButton>
        </Stack>
      </Stack>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <span style={{ fontSize: '0.875rem', color: theme.palette.text.secondary }}>
            Active filters:
          </span>
          {filters.search && (
            <Chip
              label={`Search: "${filters.search}"`}
              onDelete={() => updateFilters({ search: '' })}
              size="small"
              variant="outlined"
            />
          )}
          {filters.category && (
            <Chip
              label={`Category: ${categoryOptions.find(opt => opt.value === filters.category)?.label}`}
              onDelete={() => updateFilters({ category: '' })}
              size="small"
              variant="outlined"
            />
          )}
          {filters.rarity && (
            <Chip
              label={`Rarity: ${rarityOptions.find(opt => opt.value === filters.rarity)?.label}`}
              onDelete={() => updateFilters({ rarity: '' })}
              size="small"
              variant="outlined"
            />
          )}
          <Chip
            label="Clear All"
            onClick={clearFilters}
            size="small"
            variant="outlined"
            color="secondary"
            sx={{ cursor: 'pointer' }}
          />
        </Stack>
      )}
    </Box>
  );
}

