// ** Global Imports
import React from 'react'
import PropTypes from 'prop-types'
import { Box, Avatar, Typography, Chip } from '@mui/material'
import { roleObjMini, roleColor } from 'src/utils/map'

const UserBox = props => {
  const { userData } = props
  const avatar = userData?.avatar || '/logos/logo.svg'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar alt={userData?.name} src={avatar} sx={{ width: 32, height: 32, mr: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography component='div' variant='h6'>
          {userData?.name || '-'}
          <Chip
            sx={{ ml: 1 }}
            label={`${roleObjMini[userData?.role]}`}
            color={roleColor[userData?.role]}
            size='small'
          />
        </Typography>
        <Typography
          component='div'
          variant='body2'
          sx={{
            color: 'text.disabled',
            whiteSpace: 'nowrap',
            overflow: { xs: 'hidden', md: 'visible' },
            textOverflow: { xs: 'ellipsis', md: 'clip' },
            maxWidth: { xs: '200px', md: 'none' } // Giới hạn chiều rộng chỉ trên mobile
          }}
        >
          {userData?.email || '-'}
        </Typography>
      </Box>
    </Box>
  )
}

UserBox.propTypes = {
  userData: PropTypes.object,
  showChip: PropTypes.bool,
  showCode: PropTypes.bool,
  hideEmail: PropTypes.bool
}

export default UserBox
