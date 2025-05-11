// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useState } from 'react'

// ** Custom Component Import
import { useAuth } from 'src/hooks/useAuth'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TableHeader = props => {
  // ** Props
  const {
    handleFilter,
    toggle,
    value,
    onSearch,
    statusFilter,
    handleStatusFilter,
    verifiedFilter,
    handleVerifiedFilter
  } = props

  const user = useAuth().user

  return (
    <Grid container spacing={3} sx={{ py: 4, px: 6 }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FormControl size='small' fullWidth>
          <InputLabel id='status-select-label'>Hoạt động</InputLabel>
          <Select labelId='status-select-label' value={statusFilter} label='Hoạt động' onChange={handleStatusFilter}>
            <MenuItem value=''>
              <em>Tất cả trạng thái</em>
            </MenuItem>
            <MenuItem value='active'>Đang hoạt động</MenuItem>
            <MenuItem value='inactive'>Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <FormControl size='small' fullWidth>
          <InputLabel id='Verified-select-label'>Xác thực</InputLabel>
          <Select
            labelId='Verified-select-label'
            value={verifiedFilter}
            label='Xác thực'
            onChange={handleVerifiedFilter}
          >
            <MenuItem value=''>
              <em>Tất cả</em>
            </MenuItem>
            <MenuItem value={true}>Đã xác thực</MenuItem>
            <MenuItem value={false}>Chưa xác thực</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder='Nhập tên hoặc email'
          fullWidth
          onChange={e => {
            handleFilter(e.target.value)
            onSearch({}, 0)
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            ),
            endAdornment: (
              <IconButton
                size='small'
                title='Clear'
                aria-label='Clear'
                onClick={() => {
                  handleFilter('')
                }}
              >
                <Icon fontSize='1.25rem' icon='tabler:x' />
              </IconButton>
            )
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        {user.role === 'admin' && (
          <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
            <Icon fontSize='1.125rem' icon='tabler:user-plus' />
            Thêm mới
          </Button>
        )}
      </Grid>
    </Grid>
  )
}

export default TableHeader
