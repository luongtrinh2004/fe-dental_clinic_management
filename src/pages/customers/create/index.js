/* eslint-disable padding-line-between-statements */
import { useState } from 'react'
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Typography,
  Stack,
  Chip
} from '@mui/material'
import { useRouter } from 'next/router'
import axios from 'axios'
import DatePicker from 'react-multi-date-picker'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const genderMap = {
  Nam: 0,
  Nữ: 1,
  Khác: 2
}

const CreatePatientsPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    address: '',
    medicalService: '',
    note: '',
    cost: '',
    appointmentDate: '',
    nextAppointmentDates: []
  })
  const [selectedDate, setSelectedDate] = useState(null)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddDate = () => {
    if (!selectedDate) return
    const newDate = selectedDate.toDate()
    const isDuplicate = formData.nextAppointmentDates.some(d => new Date(d).toDateString() === newDate.toDateString())
    if (!isDuplicate) {
      setFormData(prev => ({
        ...prev,
        nextAppointmentDates: [...prev.nextAppointmentDates, newDate]
      }))
      setSelectedDate(null)
    }
  }

  const handleSubmit = async () => {
    try {
      const { name, gender, dateOfBirth, phone, address } = formData
      const token = localStorage.getItem('accessToken')

      if (!name || !gender || !dateOfBirth || !phone || !address) {
        alert('Vui lòng nhập đầy đủ thông tin bệnh nhân!')

        return
      }

      setIsLoading(true)

      // 1. Tạo bệnh nhân
      const patientRes = await axios.post(
        `${API_URL}/v1/patients`,
        {
          name,
          gender: genderMap[gender],
          dateOfBirth,
          phone,
          address
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const createdPatientId = patientRes.data._id || patientRes.data.id

      // 2. Tạo lịch sử khám nếu có nhập
      if (formData.medicalService && formData.appointmentDate) {
        await axios.post(
          `${API_URL}/v1/medical-history`,
          {
            patientId: createdPatientId,
            medicalService: formData.medicalService,
            note: formData.note || '',
            cost: parseInt(formData.cost || 0),
            appointmentDate: formData.appointmentDate,
            nextAppointmentDates: formData.nextAppointmentDates || []
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      }

      alert('Tạo bệnh nhân thành công!')
      router.push('/customers')
    } catch (error) {
      console.error('Lỗi khi tạo bệnh nhân:', error.response?.data || error.message)
      alert('Đã xảy ra lỗi. Vui lòng kiểm tra lại dữ liệu!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tạo bệnh nhân mới' />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='Họ tên'
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select value={formData.gender} label='Giới tính' onChange={e => handleChange('gender', e.target.value)}>
                <MenuItem value='Nam'>Nam</MenuItem>
                <MenuItem value='Nữ'>Nữ</MenuItem>
                <MenuItem value='Khác'>Khác</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label='Ngày sinh'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={e => handleChange('dateOfBirth', e.target.value)}
              fullWidth
            />
            <TextField
              label='Số điện thoại'
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              fullWidth
            />
            <TextField
              label='Địa chỉ'
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              fullWidth
            />

            <hr />
            <Typography variant='h6'>Thông tin khám</Typography>

            <TextField
              label='Dịch vụ'
              value={formData.medicalService}
              onChange={e => handleChange('medicalService', e.target.value)}
              fullWidth
            />
            <TextField
              label='Ghi chú'
              value={formData.note}
              onChange={e => handleChange('note', e.target.value)}
              fullWidth
            />
            <TextField
              label='Chi phí'
              type='number'
              value={formData.cost}
              onChange={e => handleChange('cost', e.target.value)}
              fullWidth
            />
            <TextField
              label='Ngày khám'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={formData.appointmentDate}
              onChange={e => handleChange('appointmentDate', e.target.value)}
              fullWidth
            />

            <Typography variant='body2'>Ngày hẹn tái khám</Typography>
            <Stack direction='row' spacing={1} flexWrap='wrap' sx={{ mb: 1 }}>
              {formData.nextAppointmentDates.map((date, index) => (
                <Chip
                  key={index}
                  label={new Date(date).toLocaleDateString('vi-VN')}
                  onDelete={() =>
                    setFormData(prev => ({
                      ...prev,
                      nextAppointmentDates: prev.nextAppointmentDates.filter((_, i) => i !== index)
                    }))
                  }
                  color='primary'
                  variant='outlined'
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>

            <Stack direction='row' spacing={2} alignItems='center'>
              <DatePicker
                format='DD/MM/YYYY'
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder='Chọn ngày hẹn mới'
                style={{ width: '100%' }}
              />
              <Button variant='outlined' onClick={handleAddDate}>
                Thêm
              </Button>
            </Stack>

            <Button variant='contained' sx={{ mt: 2 }} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Đang tạo...' : 'Tạo bệnh nhân'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

CreatePatientsPage.acl = {
  action: 'read',
  subject: 'create-customer-page'
}

export default CreatePatientsPage
