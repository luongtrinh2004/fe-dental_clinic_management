import Typography from '@mui/material/Typography'

/**
 * Check the token is expired or not
 * @param {number} dateTime - The datetime to check
 * @return {Boolean}
 */
export const isExpired = exp => {
  let now = Date.now()

  return exp * 1000 < now
}

export const convertTime = dateTime => {
  const date = new Date(dateTime)

  const addLeadingZero = num => (num < 10 ? `0${num}` : num)

  // Sử dụng các phiên bản địa phương
  const hour = addLeadingZero(date.getHours())
  const minute = addLeadingZero(date.getMinutes())
  const second = addLeadingZero(date.getSeconds())
  const day = addLeadingZero(date.getDate()) // Sử dụng getDate() thay vì getUTCDate()
  const month = addLeadingZero(date.getMonth() + 1) // Tháng bắt đầu từ 0
  const year = date.getFullYear()

  return `${hour}:${minute}:${second} ${day}/${month}/${year}`
}

export const roundNumber = number => {
  const roundedNumber = Math.round(number * 10) / 10

  return roundedNumber
}

export const converMonthToString = monthNumber => {
  const stringMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  if (monthNumber >= 1 && monthNumber <= 12) {
    return stringMonths[monthNumber - 1]
  } else {
    return 'Invalid Month!'
  }
}

//Chuyển thời gian thành Cell
export const convertTimeToTableCell = dateTime => {
  const date = new Date(dateTime)

  const addLeadingZero = num => (num < 10 ? `0${num}` : num)

  const hour = addLeadingZero(date.getHours())
  const minute = addLeadingZero(date.getMinutes())
  const second = addLeadingZero(date.getSeconds())
  const day = addLeadingZero(date.getDate())
  const month = addLeadingZero(date.getMonth() + 1) // Tháng bắt đầu từ 0
  const year = date.getFullYear()

  const timeString = `${hour}:${minute}:${second}`
  const dateString = `${day}/${month}/${year}`

  return (
    <>
      <Typography noWrap variant='subtitle' sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {timeString}
        <br />
        {dateString}
      </Typography>
    </>
  )
}

export const formatDate = dateString => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }

  return new Date(dateString).toLocaleDateString('en-GB', options)
}
