/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Actions Imports
import { createUser } from 'src/api/user'
import { VALID_PASSWORD_REGEX } from 'src/constants/regex'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  email: yup.string().email('Email không đúng định dạng').required('Email là bắt buộc'),
  password: yup
    .string()
    .test('is-empty-or-valid', 'Mật khẩu phải có ít nhất 6 ký tự', value => !value || VALID_PASSWORD_REGEX.test(value))
    .nullable(),
  name: yup
    .string()
    .required('Tên là bắt buộc')
    .min(3, 'Tên phải có ít nhất 3 ký tự')
    .max(30, 'Tên không được vượt quá 30 ký tự')
})

const defaultValues = {
  email: 'tpl@gmail.com',
  password: '123456a',
  name: 'TPL',
  role: 'staff'
}

const DrawerLocalManager = props => {
  // ** Props
  const { open, toggle, fetchData } = props

  // ** State
  const [role, setRole] = useState('staff')
  const [loading, setLoading] = useState(false)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = useCallback(
    async data => {
      try {
        setLoading(true)

        // Remove password field if it's empty
        if (!data.password) {
          delete data.password
        }

        await createUser(data).then(() => {
          toggle()
          reset()
          setLoading(false)
          if (fetchData) {
            fetchData()
            toast.success('Thành công!')
          }
        })
      } catch (error) {
        setLoading(false)
      }
    },
    [role, toggle, reset, fetchData]
  )

  const handleClose = () => {
    setRole('staff')
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100vw', sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Thêm nhân viên</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Họ và tên'
                onChange={onChange}
                error={Boolean(errors.name)}
                {...(errors.name && { helperText: errors.name.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.email)}
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Password'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.password)}
                {...(errors.password && { helperText: errors.password.message })}
              />
            )}
          />
          <Typography sx={{ mt: -3, mb: 2, color: 'orange' }}>
            Ghi chú: Nếu không nhập mật khẩu, mật khẩu random sẽ được gửi đến email.
          </Typography>

          <CustomTextField
            select
            fullWidth
            value={role}
            sx={{ mb: 4 }}
            label='Role'
            onChange={e => setRole(e.target.value)}
            SelectProps={{ value: role, onChange: e => setRole(e.target.value) }}
          >
            <MenuItem value='staff'>Nhân viên</MenuItem>
          </CustomTextField>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LoadingButton loading={loading} variant='contained' sx={{ mr: 3 }} type='submit'>
              Xác nhận
            </LoadingButton>
            <Button
              variant='tonal'
              color='secondary'
              onClick={() => {
                handleClose()
              }}
            >
              Huỷ
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default DrawerLocalManager
