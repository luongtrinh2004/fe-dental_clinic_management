// ** Global Imports
import PropTypes from 'prop-types'
import Table from '@mui/material/Table'
import Paper from '@mui/material/Paper'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import VoiceOverOffIcon from '@mui/icons-material/VoiceOverOff'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import { Box, IconButton, Tooltip } from '@mui/material'
import { toast } from 'react-hot-toast'

// ** Local Imports
import CustomChip from 'src/@core/components/mui/chip'
import { useAuth } from 'src/hooks/useAuth'
import { userStatusObj, userVerifiedObj, statusMap } from 'src/utils/map'
import { convertTimeToTableCell } from 'src/utils/base'
import UserBox from 'src/@core/components/user-box'

const headCells = [
  { id: 'stt', center: true, label: 'STT' },
  { id: 'name', center: false, label: 'Người dùng' },
  { id: 'region', center: false, label: 'Khu vực' },
  { id: 'verified', center: true, label: 'Xác thực' },
  { id: 'status', center: true, label: 'Trạng thái' },
  { id: 'join', center: true, label: 'Tham gia lúc' }
]
function AdminTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell key={headCell.id} align={headCell.center === true ? 'center' : 'left'} padding={'normal'}>
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align='center'>Hành động</TableCell>
      </TableRow>
    </TableHead>
  )
}

const AdminTable = props => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    openEdit = () => {},
    setRowData = () => {},
    openDeactive = () => {},
    openActive = () => {}
  } = props

  const userId = useAuth().user.id

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
          <AdminTableHead />
          <TableBody>
            {items.map((dataRow, index) => (
              <TableRow key={dataRow.id}>
                <TableCell align='center'>{index + 1}</TableCell>

                <TableCell>
                  <UserBox userData={dataRow} />
                </TableCell>

                <TableCell align='left'>
                  <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    {dataRow?.region?.name || '-'}
                  </Typography>
                </TableCell>

                <TableCell align='center'>
                  <CustomChip
                    label={dataRow.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    color={userVerifiedObj[dataRow.isEmailVerified]}
                  />
                </TableCell>

                <TableCell align='center'>
                  <CustomChip label={statusMap[dataRow.status]} color={userStatusObj[dataRow.status]} />
                </TableCell>

                <TableCell align='center'>{convertTimeToTableCell(dataRow.createdAt)}</TableCell>

                <TableCell align='center'>
                  <Tooltip title='Chỉnh sửa' sx={{ mr: 2 }}>
                    <IconButton
                      onClick={() => {
                        openEdit(true)
                        setRowData(dataRow)
                      }}
                      size='small'
                    >
                      <BorderColorIcon />
                    </IconButton>
                  </Tooltip>
                  {dataRow.status === 'active' ? (
                    <Tooltip title='Vô hiệu hoá' sx={{ mr: 2 }}>
                      <IconButton
                        disableRipple={userId === dataRow.id}
                        onClick={() => {
                          if (userId === dataRow.id) {
                            toast.error('Không thể vô hiệu hóa tài khoản của chính mình')
                          } else {
                            openDeactive(true)
                            setRowData(dataRow)
                          }
                        }}
                        size='small'
                      >
                        <VoiceOverOffIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title='Kích hoạt' sx={{ mr: 2 }}>
                      <IconButton
                        onClick={() => {
                          openActive(true)
                          setRowData(dataRow)
                        }}
                        size='small'
                      >
                        <RecordVoiceOverIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        rowsPerPageOptions={[20, 30, 50, 100]}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  )
}

AdminTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  openEdit: PropTypes.func,
  setRowData: PropTypes.func
}

export default AdminTable
