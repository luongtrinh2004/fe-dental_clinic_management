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
      path: '/acl',
      title: 'Access Control',
      icon: 'tabler:shield'
    },
    {
      path: '/customers',
      title: 'Khách Hàng',
      icon: 'tabler:users'
    },
    {
      path: '/services',
      title: 'Dịch Vụ',
      icon: 'tabler:tools'
    },
    {
      path: '/settings',
      title: 'Cài Đặt',
      icon: 'tabler:settings'
    }
  ]
}

export default navigation
