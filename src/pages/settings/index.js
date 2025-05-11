// ** React Imports
import { useContext } from 'react'

// ** MUI Imports
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  Typography,
  Box
} from '@mui/material'

// ** Context
import { SettingsContext } from 'src/@core/context/settingsContext'

const SettingsPage = () => {
  const { settings, saveSettings } = useContext(SettingsContext)

  const handleChange = (field, value) => {
    saveSettings({ ...settings, [field]: value })
  }

  const handleSwitch = field => {
    saveSettings({ ...settings, [field]: !settings[field] })
  }

  const themeColors = ['primary', 'secondary', 'success', 'error', 'warning', 'info']

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Cài đặt giao diện' />
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Skin */}
            <FormControl>
              <FormLabel>Skin</FormLabel>
              <RadioGroup row value={settings.skin} onChange={e => handleChange('skin', e.target.value)}>
                <FormControlLabel value='default' control={<Radio />} label='Default' />
                <FormControlLabel value='bordered' control={<Radio />} label='Bordered' />
              </RadioGroup>
            </FormControl>

            {/* Mode */}
            <FormControl>
              <FormLabel>Chế độ (Mode)</FormLabel>
              <RadioGroup row value={settings.mode} onChange={e => handleChange('mode', e.target.value)}>
                <FormControlLabel value='light' control={<Radio />} label='Light' />
                <FormControlLabel value='dark' control={<Radio />} label='Dark' />
                <FormControlLabel value='semi-dark' control={<Radio />} label='Semi Dark' />
              </RadioGroup>
            </FormControl>

            {/* Primary Color */}
            <Box>
              <FormLabel>Màu chủ đề</FormLabel>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                {themeColors.map(color => (
                  <Box
                    key={color}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: `${color}.main`,
                      border: settings.themeColor === color ? '2px solid #000' : '2px solid transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleChange('themeColor', color)}
                  />
                ))}
              </Box>
            </Box>

            {/* Content Width */}
            <FormControl>
              <FormLabel>Chiều rộng nội dung</FormLabel>
              <RadioGroup
                row
                value={settings.contentWidth}
                onChange={e => handleChange('contentWidth', e.target.value)}
              >
                <FormControlLabel value='full' control={<Radio />} label='Full' />
                <FormControlLabel value='boxed' control={<Radio />} label='Boxed' />
              </RadioGroup>
            </FormControl>

            {/* AppBar Type */}
            <FormControl>
              <FormLabel>AppBar Type</FormLabel>
              <RadioGroup row value={settings.appBar} onChange={e => handleChange('appBar', e.target.value)}>
                <FormControlLabel value='fixed' control={<Radio />} label='Fixed' />
                <FormControlLabel value='static' control={<Radio />} label='Static' />
                <FormControlLabel value='hidden' control={<Radio />} label='Hidden' />
              </RadioGroup>
            </FormControl>

            {/* Footer Type */}
            <FormControl>
              <FormLabel>Footer Type</FormLabel>
              <RadioGroup row value={settings.footer} onChange={e => handleChange('footer', e.target.value)}>
                <FormControlLabel value='fixed' control={<Radio />} label='Fixed' />
                <FormControlLabel value='static' control={<Radio />} label='Static' />
                <FormControlLabel value='hidden' control={<Radio />} label='Hidden' />
              </RadioGroup>
            </FormControl>

            {/* AppBar Blur */}
            <FormControlLabel
              control={<Switch checked={settings.appBarBlur} onChange={() => handleSwitch('appBarBlur')} />}
              label='Làm mờ AppBar'
            />

            {/* Nav Collapsed */}
            <FormControlLabel
              control={<Switch checked={settings.navCollapsed} onChange={() => handleSwitch('navCollapsed')} />}
              label='Thu gọn Navigation'
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SettingsPage
