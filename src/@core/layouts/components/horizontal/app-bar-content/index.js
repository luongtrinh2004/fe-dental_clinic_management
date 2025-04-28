// ** Next Import
import Link from 'next/link'
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'
import { useSettings } from 'src/@core/hooks/useSettings'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const AppBarContent = props => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props
  const mode = useSettings().settings.mode

  // ** Hooks
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <LinkStyled href='/'>
          {mode === 'light' ? (
            <Image src='/logos/logo-phenikaa-light.png' alt='PhenikaaX Logo' width={34} height={34} />
          ) : (
            <Image src='/logos/logo-phenikaa-dark.png' alt='PhenikaaX Logo' width={34} height={34} />
          )}
          {mode === 'light' ? (
            <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px', color: '#223771' }}>
              PhenikaaX
            </Typography>
          ) : (
            <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 700, lineHeight: '24px', color: '#FFFFFFF2' }}>
              PhenikaaX
            </Typography>
          )}
        </LinkStyled>
      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
