export type Provider = {
  id: string
  name: string
  category: string
  subcategory: string
  city: string
  rating: number
  reviewCount: number
  price: number
  availability: string[]
  image: string
  bio: string
  verified: boolean
  services: Array<{
    id: string
    name: string
    duration: string
    price: number
  }>
}

export const fallbackProviders: Provider[] = [
  {
    id: 'p1',
    name: 'Rapid Rooter Plumbing',
    category: 'Plumbing',
    subcategory: 'Emergency Repairs',
    city: 'San Francisco',
    rating: 4.9,
    reviewCount: 128,
    price: 75,
    availability: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmV9LjkegMuenI7riu1vx_ukSrgbkzpR0jcgCtjVMmzZrbaC0qmpskJ39yrR5de7BC2fM3OAZvl-SgHPBiaoR0DakW2C_cDui4kp6YqiZ17LmzjCB5_urtAam9a-PCY39LmHuSEvXBc-oQQ5wLZb8kAs1UjdzS6aZrOWHyG9GLnuC2JX-HKDnGwD_IYcv55G0rYscKihQKpPKz7lzwmhtELA-aiBBE8c8YS-qhplRvJunjf0b9RBPKfg6eQamthoS7xT_23Di_3fDT',
    bio: 'Leaky faucets, clogged drains, water heater issues. We fix it all.',
    verified: true,
    services: [
      { id: 's1', name: 'Drain Cleaning', duration: '45 min', price: 95 },
      { id: 's2', name: 'Pipe Repair', duration: '60 min', price: 120 },
      { id: 's3', name: 'Water Heater Service', duration: '90 min', price: 190 },
    ],
  },
  {
    id: 'p2',
    name: 'The Pipe Doctor',
    category: 'Plumbing',
    subcategory: 'Residential',
    city: 'San Francisco',
    rating: 4.8,
    reviewCount: 97,
    price: 85,
    availability: ['8:00 AM', '9:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDI1iZj6O0Pf21-Whr6UU9Rz_9CWVDJsTqzT9_f9ArqSQsypZar8LOIvCgQ-hYNoWfaNiaPyY8nKJX0F4gnainVjGDQAaElDXKLpJ7FvBJCzLHOj9jG80u6vLb5JHVKr7WI-htKTZbFEZutWPjxjAOMWUpxSHpom_mGqVW56MWmsrPvsP9-J9r9rFMfnajjyxJ5ZtIDywxv36i5pKVMuDi8eG-eQUmP7PBd9myHkcF7cpg4-wP1du952aojshDI9vQ8-sgRPhXWdMAx',
    bio: '24/7 emergency plumbing services. Your local expert.',
    verified: true,
    services: [
      { id: 's4', name: 'Emergency Callout', duration: '60 min', price: 120 },
      { id: 's5', name: 'Leak Detection', duration: '60 min', price: 140 },
      { id: 's6', name: 'Toilet Replacement', duration: '90 min', price: 170 },
    ],
  },
  {
    id: 'p3',
    name: 'Golden Gate Plumbers',
    category: 'Plumbing',
    subcategory: 'Installations',
    city: 'San Francisco',
    rating: 4.7,
    reviewCount: 210,
    price: 70,
    availability: ['9:30 AM', '10:30 AM', '1:30 PM', '3:00 PM', '4:00 PM'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDpILbma2Q2VPSgwFzWcQNzW-PVoBul2prvDqZlyHR6yaoo9xiSE1muF0wQkYcEkyIw108pAiIk65BSvwwLyDhIiZHAf8bjCUgXfbJFqCqNKnrvDi6zP9sZJFsG5FhJYFTj-aeGs5042luEsCa_gG-zNeG_oXqVRxexbKhYzTrSlHAjZMh-eZ-KAQsZRSFntQR3vbrT2j_6_JyK8ubWuPLqRU37S5IiOqHojHyLSncVDfLw__zVKUIsoD91ciqXiOLggVJLEV1Ds0ps',
    bio: 'Family-owned and operated. We take pride in our work.',
    verified: true,
    services: [
      { id: 's7', name: 'Kitchen Plumbing', duration: '90 min', price: 150 },
      { id: 's8', name: 'Bathroom Fixture Install', duration: '60 min', price: 110 },
      { id: 's9', name: 'Backflow Testing', duration: '60 min', price: 100 },
    ],
  },
]

export const fallbackProfile = {
  id: 'u1',
  fullName: 'Alex Morgan',
  email: 'alex@example.com',
  phone: '+1 (415) 555-0147',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
}

export const fallbackBookings = [
  {
    id: 'b1',
    providerName: 'Rapid Rooter Plumbing',
    serviceName: 'Drain Cleaning',
    date: 'Tue, Jun 18',
    time: '11:00 AM',
    status: 'Confirmed',
    amount: '$95',
  },
  {
    id: 'b2',
    providerName: 'The Pipe Doctor',
    serviceName: 'Leak Detection',
    date: 'Thu, Jun 20',
    time: '2:00 PM',
    status: 'Pending',
    amount: '$140',
  },
]
