import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import toast from 'react-hot-toast'
import { updateUser } from 'src/api/user'
import LoadingButton from '@mui/lab/LoadingButton'
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, TextField } from '@mui/material'

const AdminDialog = props => {
  const {
    open = false,
    toggleDialog = () => {},
    row = [],
    refresh = () => {},
    openDeactive = false,
    toggleDeactive = () => {},
    openActive = false,
    toggleActive = () => {}
  } = props

  const schema = yup.object().shape({
    email: yup.string().email('Email must be valid email').required('Email is required'),
    name: yup
      .string()
      .required('Name is required')
      .min(3, 'Name must have at least 3 characters')
      .max(30, 'Name allows up to 30 characters')
  })

  const defaultValues = {
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || ''
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [regions, setRegions] = useState([])
  const [regionFilter, setRegionFilter] = useState(null)

  // Fetch regions on component mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = { data: [] }
        const { data } = response

        const formattedRegions = data.map(region => ({
          id: region.id,
          name: region.name,
          firstLetter: region.name.charAt(0).toUpperCase()
        }))
        setRegions(formattedRegions)
      } catch (error) {
        console.error('Error fetching regions:', error)
        toast.error('Không thể tải danh sách khu vực')
      }
    }
    fetchRegions()
  }, [])

  useEffect(() => {
    // So sánh id từ row.region với regions
    const currentRegion = regions.find(r => r.id === row.region?.id) || null

    reset({
      name: row.name || '',
      email: row.email || '',
      region: currentRegion ? currentRegion.id : null
    })

    setRegionFilter(currentRegion)
  }, [row, reset, regions])

  const handleRegionFilter = value => {
    setRegionFilter(value)

    // Update form data with new region ID
    reset({
      name: row.name || '',
      email: row.email || '',
      region: value ? value.id : null
    })
  }

  const [loading, setLoading] = useState(false)

  const onSubmit = async data => {
    try {
      setLoading(true)
      await updateUser(id, data)
      refresh()
      toast.success(`Thành công`)
    } catch (error) {
    } finally {
      setTimeout(function () {
        setLoading(false)
      }, 500)
      toggleDialog(false)
    }
  }

  const id = row.id

  return (
    <>
      {/* Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => toggleDialog(false)}
        aria-labelledby='user-view-edit'
        aria-describedby='user-view-edit-description'
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
      >
        <DialogTitle
          id='user-view-edit'
          sx={{
            textAlign: 'center',
            fontSize: '1.5rem !important',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          Chỉnh sửa thông tin
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
          }}
        >
          <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
            Vui lòng điền thông tin mới cho nhân viên
          </DialogContentText>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Họ và tên'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.name)}
                      {...(errors.name && { helperText: errors.name.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Email'
                      value={value}
                      disabled={row.isEmailVerified}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size='small'
                  id='autocomplete-grouped'
                  groupBy={option => option.firstLetter}
                  getOptionLabel={option => (option ? option.name : '')}
                  isOptionEqualToValue={(option, value) => option?.id === value?.id}
                  onChange={(event, value) => handleRegionFilter(value)}
                  value={regionFilter}
                  options={regions.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                  renderInput={params => <TextField {...params} label='Khu vực' />}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ pt: theme => `${theme.spacing(6.5)} !important`, display: 'flex', justifyContent: 'right' }}
            >
              <LoadingButton loading={loading} variant='contained' sx={{ mr: 3 }} type='submit'>
                Xác nhận
              </LoadingButton>
              <Button
                variant='tonal'
                color='secondary'
                onClick={() => {
                  toggleDialog(false)
                  reset(defaultValues)
                }}
              >
                Huỷ
              </Button>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={openDeactive}
        onClose={() => {
          toggleDeactive(false)
        }}
        aria-labelledby='dialog-title'
        aria-describedby='dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={'tabler:alert-circle-filled'} fontSize={24} style={{ marginRight: 6 }} />
            Xác nhận vô hiệu hóa
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='dialog-description'>
            {`Bạn có chắc chắn muốn vô hiệu hoá tài khoản ${row.name} không? Sau khi vô hiệu hoá, tài khoản sẽ không thể đăng nhập vào hệ thống.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={async () => {
              try {
                const data = { status: 'inactive' }
                await updateUser(id, data)
                refresh()
                toast.success(`Vô hiệu hoá thành công`)
              } catch (error) {
              } finally {
                toggleDeactive(false)
              }
            }}
          >
            Xác nhận
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              toggleDeactive(false)
            }}
          >
            Huỷ
          </Button>
        </DialogActions>
      </Dialog>
      {/* Activate Confirmation Dialog */}
      <Dialog
        open={openActive}
        onClose={() => {
          toggleActive(false)
        }}
        aria-labelledby='dialog-title'
        aria-describedby='dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon icon={'tabler:alert-circle-filled'} fontSize={24} style={{ marginRight: 6 }} />
            Xác nhận kích hoạt tài khoản
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='dialog-description'>
            {`Bạn có chắc chắn muốn kích hoạt tài khoản ${row.name} không? Sau khi kích hoạt, tài khoản có thể đăng nhập trở lại hệ thống.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            onClick={async () => {
              try {
                const data = { status: 'active' }
                await updateUser(id, data)
                refresh()
                toast.success(`Kích hoạt thành công`)
              } catch (error) {
              } finally {
                toggleActive(false)
              }
            }}
          >
            Xác nhận
          </Button>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              toggleActive(false)
            }}
          >
            Huỷ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AdminDialog
