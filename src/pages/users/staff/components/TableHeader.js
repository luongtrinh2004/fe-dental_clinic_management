import { useEffect, useCallback } from 'react'

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
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

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
    regionFilter,
    handleRegionFilter,
    verifiedFilter,
    handleVerifiedFilter
  } = props

  const user = useAuth().user

  const [options, setOptions] = useState([])
  const [regionList, setRegionList] = useState([])

  useEffect(() => {
    const updateOptions = () => {
      const updatedOptions = regionList.map(option => {
        const firstLetter = option.name[0].toUpperCase()

        return {
          firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
          ...option
        }
      })
      setOptions(updatedOptions)
    }

    updateOptions()
  }, [regionList])

  const fetchFilterData = useCallback(async () => {
    const res = { data: [] }
    setRegionList(res.data)
  }, [])

  useEffect(() => {
    fetchFilterData()
  }, [fetchFilterData])

  return (
    <Grid container spacing={3} sx={{ py: 4, px: 6 }}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Autocomplete
          size='small'
          id='autocomplete-grouped'
          groupBy={option => option.firstLetter}
          getOptionLabel={option => option.name || ''}
          onChange={(event, value) => {
            handleRegionFilter(value)
          }}
          value={regionFilter}
          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          renderInput={params => <TextField {...params} label='Khu vực' />}
        />
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
