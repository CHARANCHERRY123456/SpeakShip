//src/features/profile/constants/profileFeild.js
export const PROFILE_FIELDS = [
    {
      id: 'role',
      label: 'Role',
      icon: 'Tag',
      transform: (value) => value?.charAt(0).toUpperCase() + value?.slice(1)
    },
    {
      id: 'name',
      label: 'Full Name',
      icon: 'User',
      fallback: 'Not provided'
    },
    {
      id: 'email',
      label: 'Email Address',
      icon: 'Mail'
    },
    {
      id: 'username',
      label: 'Username',
      icon: 'Key'
    },
    {
      id: 'phone',
      label: 'Phone Number',
      icon: 'Phone',
      fallback: 'Not provided'
    }
  ];