// ** MUI Imports
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { useSettings } from 'src/@core/hooks/useSettings'
import Image from 'next/image'

const FallbackSpinner = ({ sx }) => {
  // ** Hook
  const theme = useTheme()
  const mode = useSettings().settings.mode

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      {mode === 'light' ? (
        <Image src='/logos/logo-phenikaa-light.png' alt='PhenikaaX Logo' width={82} height={82} priority />
      ) : (
        <Image src='/logos/logo-phenikaa-dark.png' alt='PhenikaaX Logo' width={82} height={82} priority />
      )}
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
