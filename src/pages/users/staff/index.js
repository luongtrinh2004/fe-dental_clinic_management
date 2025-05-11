import { useState, useEffect, useCallback, useRef } from 'react'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'

import DrawerLocalManager from './components/Drawer'
import TableHeader from './components/TableHeader'
import AdminTable from './components/Table'
import AdminDialog from './components/Dialog'
import { getUsers } from 'src/api/user'

const LocalAdminListPage = () => {
  // ** State
  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [value, setValue] = useState('')
  const [dataTable, setDataTable] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeactive, setOpenDeactive] = useState(false)
  const [openActive, setOpenActive] = useState(false)
  const [rowData, setRowData] = useState([])
  const [regionFilter, setRegionFilter] = useState('')
  const [verifiedFilter, setVerifiedFilter] = useState('')
  const valueRef = useRef(null)

  // ** Hooks

  const fetchData = useCallback(async () => {
    try {
      let params = { role: 'staff', page: page + 1, limit: rowsPerPage }
      if (valueRef.current != '') {
        params.searchTerm = valueRef.current
      }

      if (regionFilter) {
        params.region = regionFilter?.id
      }

      if (verifiedFilter !== undefined && verifiedFilter !== '') {
        params.isEmailVerified = verifiedFilter
      }
      const response = await getUsers(params)
      setTotal(response.totalResults)
      setDataTable(response.results)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, valueRef.current, regionFilter, verifiedFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleFilter = useCallback(val => {
    setValue(val)
    valueRef.current = val
  }, [])

  const handlePageChange = useCallback((event, value) => {
    setPage(value)
  }, [])

  const handleRowsPerPageChange = useCallback(event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }, [])

  const handleRegionFilter = useCallback(event => {
    setRegionFilter(event)
    setPage(0)
  }, [])

  const handleVerifiedFilter = useCallback(event => {
    const value = event.target.value
    setVerifiedFilter(value)
    setPage(0)
  }, [])

  const toggleAddAdminDrawer = () => setAddAdminOpen(!addAdminOpen)

  return (
    <>
      <Card>
        <CardHeader title='Danh sách nhân viên' />
        <Divider sx={{ m: '0 !important' }} />
        <TableHeader
          value={value}
          handleFilter={handleFilter}
          toggle={toggleAddAdminDrawer}
          onSearch={handlePageChange}
          regionFilter={regionFilter}
          handleRegionFilter={handleRegionFilter}
          verifiedFilter={verifiedFilter}
          handleVerifiedFilter={handleVerifiedFilter}
        />
        <Divider sx={{ m: '0 !important' }} />
        <AdminTable
          refreshData={fetchData}
          count={total}
          items={dataTable}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          openEdit={setOpenDialog}
          setRowData={setRowData}
          openDeactive={setOpenDeactive}
          openActive={setOpenActive}
        ></AdminTable>
      </Card>
      <DrawerLocalManager fetchData={fetchData} open={addAdminOpen} toggle={toggleAddAdminDrawer} />
      <AdminDialog
        open={openDialog}
        toggleDialog={setOpenDialog}
        row={rowData}
        refresh={fetchData}
        openDeactive={openDeactive}
        openActive={openActive}
        toggleDeactive={setOpenDeactive}
        toggleActive={setOpenActive}
      ></AdminDialog>
    </>
  )
}

LocalAdminListPage.acl = {
  action: 'read',
  subject: 'staff-page'
}

export default LocalAdminListPage
