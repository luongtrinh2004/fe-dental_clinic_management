import { useState } from 'react'
import { Grid, Card, CardHeader, CardContent, TextField, Button, Typography, Stack, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CreateServicePage = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    services: [
      {
        name: '',
        types: [
          {
            type: '',
            price: '',
            warranty: ''
          }
        ]
      }
    ]
  })

  const handleServiceChange = (index, field, value) => {
    const updated = [...formData.services]
    updated[index][field] = value
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const handleTypeChange = (serviceIndex, typeIndex, field, value) => {
    const updated = [...formData.services]
    updated[serviceIndex].types[typeIndex][field] = value
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const handleAddService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', types: [{ type: '', price: '', warranty: '' }] }]
    }))
  }

  const handleRemoveService = index => {
    const updated = [...formData.services]
    updated.splice(index, 1)
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const handleAddType = serviceIndex => {
    const updated = [...formData.services]
    updated[serviceIndex].types.push({ type: '', price: '', warranty: '' })
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const handleRemoveType = (serviceIndex, typeIndex) => {
    const updated = [...formData.services]
    updated[serviceIndex].types.splice(typeIndex, 1)
    setFormData(prev => ({ ...prev, services: updated }))
  }

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/v1/services`, formData)
      alert('Tạo dịch vụ thành công!')
      router.push('/services')
    } catch (err) {
      console.error('Lỗi tạo dịch vụ:', err)
      alert('Có lỗi xảy ra. Vui lòng kiểm tra lại.')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tạo dịch vụ mới' />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='Tên danh mục (title)'
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />

            {formData.services.map((service, i) => (
              <Card key={i} variant='outlined' sx={{ p: 2 }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography variant='subtitle1'>Dịch vụ #{i + 1}</Typography>
                  <IconButton color='error' onClick={() => handleRemoveService(i)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>

                <TextField
                  label='Tên dịch vụ (nameService)'
                  value={service.name}
                  onChange={e => handleServiceChange(i, 'name', e.target.value)}
                  fullWidth
                  sx={{ mt: 2 }}
                />

                {service.types.map((t, j) => (
                  <Grid container spacing={2} key={j} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                      <TextField
                        label='Loại (type)'
                        value={t.type}
                        onChange={e => handleTypeChange(i, j, 'type', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label='Giá (price)'
                        value={t.price}
                        onChange={e => handleTypeChange(i, j, 'price', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label='Bảo hành (warranty)'
                        value={t.warranty}
                        onChange={e => handleTypeChange(i, j, 'warranty', e.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton color='error' onClick={() => handleRemoveType(i, j)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}

                <Button size='small' variant='outlined' sx={{ mt: 2 }} onClick={() => handleAddType(i)}>
                  + Thêm loại
                </Button>
              </Card>
            ))}

            <Button variant='outlined' onClick={handleAddService}>
              + Thêm dịch vụ
            </Button>

            <Button variant='contained' sx={{ mt: 2 }} onClick={handleSubmit}>
              Tạo dịch vụ
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default CreateServicePage
