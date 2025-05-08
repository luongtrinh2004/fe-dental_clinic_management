import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Grid, Card, CardHeader, CardContent, TextField, Button, Typography, IconButton, Box } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const UpdateServicePage = () => {
  const router = useRouter()
  const { id } = router.query

  const [formData, setFormData] = useState({
    title: '',
    services: []
  })

  const fetchService = async () => {
    try {
      const res = await axios.get(`${API_URL}/v1/services/${id}`)
      setFormData(res.data)
    } catch (err) {
      console.error('Lỗi khi tải dịch vụ:', err)
    }
  }

  useEffect(() => {
    if (id) fetchService()
  }, [id])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (i, field, value) => {
    const updated = [...formData.services]
    updated[i][field] = value
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const handleTypeChange = (i, j, field, value) => {
    const updated = [...formData.services]
    updated[i].types[j][field] = value
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', types: [{ type: '', price: '', warranty: '' }] }]
    }))
  }

  const removeService = i => {
    const updated = [...formData.services]
    updated.splice(i, 1)
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const addType = i => {
    const updated = [...formData.services]
    updated[i].types.push({ type: '', price: '', warranty: '' })
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const removeType = (i, j) => {
    const updated = [...formData.services]
    updated[i].types.splice(j, 1)
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_URL}/v1/services/${id}`, formData)
      alert('Cập nhật thành công!')
      router.push('/services')
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err)
      alert('Cập nhật thất bại.')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Chỉnh sửa dịch vụ' />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label='Tiêu đề (nếu có)'
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              fullWidth
            />

            {formData.services.map((service, i) => (
              <Box key={i} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
                <Box display='flex' gap={2} alignItems='center'>
                  <TextField
                    label='Tên dịch vụ'
                    value={service.name}
                    onChange={e => handleServiceChange(i, 'name', e.target.value)}
                    fullWidth
                  />
                  <IconButton color='error' onClick={() => removeService(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {service.types.map((type, j) => (
                  <Box key={j} display='flex' gap={2} mt={2}>
                    <TextField
                      label='Loại'
                      value={type.type}
                      onChange={e => handleTypeChange(i, j, 'type', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label='Giá'
                      value={type.price}
                      onChange={e => handleTypeChange(i, j, 'price', e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label='Bảo hành'
                      value={type.warranty}
                      onChange={e => handleTypeChange(i, j, 'warranty', e.target.value)}
                      fullWidth
                    />
                    <IconButton color='error' onClick={() => removeType(i, j)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button startIcon={<AddIcon />} onClick={() => addType(i)} sx={{ mt: 2 }}>
                  Thêm loại
                </Button>
              </Box>
            ))}

            <Button startIcon={<AddIcon />} variant='outlined' onClick={addService}>
              Thêm dịch vụ
            </Button>

            <Button variant='contained' sx={{ mt: 3 }} onClick={handleSubmit}>
              Lưu thay đổi
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UpdateServicePage
