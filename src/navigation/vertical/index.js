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
    }
  ]
}

export default navigation
