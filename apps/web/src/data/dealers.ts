export type Dealer = {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  services: string[];
  contact: {
    whatsapp: string;
    email: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const DEALERS: Dealer[] = [
  {
    name: 'Finspeed Dealer - Sarin Farm',
    address: 'Shop No. 20, Left Side, Sarin Farm Colony, UPSIDC Site A, Surajpur, Greater Noida',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    postalCode: '201306',
    services: ['Sales', 'Test rides', 'Service'],
    contact: {
      whatsapp: '+91 98 765 43210',
      email: 'sarin.farm@finspeed.example'
    },
    coordinates: {
      lat: 28.528,
      lng: 77.477
    }
  },
  {
    name: 'Finspeed Dealer - Krystal Height',
    address: 'LG Shop 8, Krystal Height Market, behind ACE CITY, Sector 1, Noida Extension, Bisrakh Jalalpur',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
    postalCode: '201306',
    services: ['Sales', 'Service'],
    contact: {
      whatsapp: '+91 98 111 22222',
      email: 'krystal.height@finspeed.example'
    },
    coordinates: {
      lat: 28.601,
      lng: 77.437
    }
  },
  {
    name: 'Finspeed Studio - Pune',
    address: 'Plot 42, Riverside Business Park, Baner',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411045',
    services: ['Sales', 'Service', 'Bike fit'],
    contact: {
      whatsapp: '+91 98 333 44444',
      email: 'pune.studio@finspeed.example'
    },
    coordinates: {
      lat: 18.559,
      lng: 73.786
    }
  }
];

export type DealerFilter = 'Sales' | 'Service' | 'Test rides' | 'Bike fit';

export const FILTERS: DealerFilter[] = ['Sales', 'Service', 'Test rides', 'Bike fit'];
