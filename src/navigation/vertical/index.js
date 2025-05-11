const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
      action: 'read',
      subject: 'home-page'
    },
    {
      title: 'Quản lý người dùng',
      icon: 'tabler:user-cog',
      children: [
        {
          title: 'Quản trị',
          path: '/users/admin'
        },
        {
          title: 'Nhân viên',
          path: '/users/staff'
        }
      ]
    },
    {
      path: '/customers',
      title: 'Khách Hàng',
      icon: 'tabler:users',
      action: 'read',
      subject: 'customer-page'
    },
    {
      path: '/services',
      title: 'Dịch Vụ',
      icon: 'tabler:tools',
      action: 'read',
      subject: 'service-page'
    },
    {
      path: '/settings',
      title: 'Cài Đặt',
      icon: 'tabler:settings',
      action: 'read',
      subject: 'setting-page'
    }
  ]
}

export default navigation
