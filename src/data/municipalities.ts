export interface Municipality {
  id: string;
  name: string;
  province: string;
  wards: Ward[];
  departments: Department[];
  fleetVehicles: FleetVehicle[];
  contactInfo: ContactInfo;
}

export interface Ward {
  number: number;
  name: string;
  areas: string[];
}

export interface Department {
  id: string;
  name: string;
  head: string;
  contactEmail: string;
  contactPhone: string;
  responsibleFor: string[];
}

export interface FleetVehicle {
  id: string;
  registration: string;
  type: 'maintenance-truck' | 'inspection-vehicle' | 'emergency-response' | 'waste-collection' | 'water-tanker' | 'supervisor-vehicle';
  status: 'available' | 'dispatched' | 'maintenance' | 'out-of-service';
  department: string;
  assignedTo?: string;
  lastMaintenance: string;
  currentLocation?: string;
}

export interface ContactInfo {
  mainOffice: string;
  emergencyLine: string;
  email: string;
  website: string;
  address: string;
}

export const SOL_PLAATJE_MUNICIPALITY: Municipality = {
  id: 'sol-plaatje',
  name: 'Sol Plaatje Local Municipality',
  province: 'Northern Cape',
  wards: [
    { number: 1, name: 'Galeshewe', areas: ['Galeshewe Extension 1', 'Galeshewe Extension 2', 'Galeshewe Extension 3'] },
    { number: 2, name: 'Royldene', areas: ['Royldene', 'Roodepan', 'Homestead'] },
    { number: 3, name: 'Kimberley CBD', areas: ['Kimberley Central', 'Beaconsfield', 'Belgravia'] },
    { number: 4, name: 'Hadison Park', areas: ['Hadison Park', 'Monument Heights', 'Civic Centre'] },
    { number: 5, name: 'Verwoerd Park', areas: ['Verwoerd Park', 'Herlear', 'Hillcrest'] },
    { number: 6, name: 'Greenpoint', areas: ['Greenpoint', 'Delportshoop Road', 'Golf Course Area'] },
    { number: 7, name: 'Ashburnham', areas: ['Ashburnham', 'New Park', 'Floors'] },
    { number: 8, name: 'Newton', areas: ['Newton', 'Kimberley North', 'Memorial Road'] },
    { number: 9, name: 'Cassandra', areas: ['Cassandra', 'Phutanang', 'Extension 9'] },
    { number: 10, name: 'Platfontein', areas: ['Platfontein', 'Schmidtsdrift', '!Xun and Khwe'] },
    { number: 11, name: 'Ritchie', areas: ['Ritchie', 'Paradise', 'Robyndale'] },
    { number: 12, name: 'De Beers', areas: ['De Beers Mining Area', 'Wesselton', 'Dutoitspan'] },
    { number: 13, name: 'Greenlands', areas: ['Greenlands', 'Industrial Area', 'Stockdale'] },
    { number: 14, name: 'West End', areas: ['West End', 'Oppenheimer Park', 'Lerato Park'] },
    { number: 15, name: 'Floors', areas: ['Floors', 'Group Areas', 'Mixed Development'] },
    { number: 16, name: 'Galeshewe West', areas: ['Galeshewe West', 'Extension 16', 'School Area'] },
    { number: 17, name: 'Industrial South', areas: ['Industrial South', 'Railway Area', 'Warehouse District'] },
    { number: 18, name: 'Minority Areas', areas: ['Various Small Communities', 'Rural Areas', 'Farms'] },
    { number: 19, name: 'Pescodia', areas: ['Pescodia', 'Rural East', 'Agricultural Area'] },
    { number: 20, name: 'Riverton', areas: ['Riverton', 'Riverside', 'Orange River Area'] },
    { number: 21, name: 'Airport Area', areas: ['Airport Precinct', 'Industrial North', 'Aviation District'] },
    { number: 22, name: 'Kimberley South', areas: ['Kimberley South', 'Suburbs', 'Residential South'] },
    { number: 23, name: 'Mining District', areas: ['Various Mining Areas', 'Compound Areas', 'Mining Infrastructure'] },
    { number: 24, name: 'Agricultural North', areas: ['Farm Areas North', 'Agricultural Holdings', 'Rural North'] },
    { number: 25, name: 'Riverton Extension', areas: ['Riverton Extension', 'New Development', 'River Access'] },
    { number: 26, name: 'Eastern Areas', areas: ['Eastern Rural', 'Small Holdings', 'Agricultural East'] },
    { number: 27, name: 'Western Rural', areas: ['Western Farms', 'Rural Communities', 'Agricultural West'] },
    { number: 28, name: 'Southern Extension', areas: ['Southern Areas', 'Rural South', 'Extended Areas'] },
    { number: 29, name: 'Northern Rural', areas: ['Northern Areas', 'Rural Communities North', 'Agricultural Holdings'] },
    { number: 30, name: 'Central Rural', areas: ['Central Areas', 'Mixed Rural', 'Agricultural Central'] },
    { number: 31, name: 'Special Areas', areas: ['Special Zones', 'Mixed Use', 'Development Areas'] },
    { number: 32, name: 'Community Areas', areas: ['Community Facilities', 'Public Areas', 'Civic Areas'] },
    { number: 33, name: 'Extended Boundaries', areas: ['Boundary Areas', 'Peripheral Areas', 'Extended Municipality'] },
  ],
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Mr. Thabo Mthembu',
      contactEmail: 'water@solplaatje.gov.za',
      contactPhone: '+27 53 830 6911',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    },
    {
      id: 'roads-infrastructure',
      name: 'Roads & Infrastructure',
      head: 'Ms. Sarah Johnson',
      contactEmail: 'roads@solplaatje.gov.za',
      contactPhone: '+27 53 830 6912',
      responsibleFor: ['Road maintenance', 'Potholes', 'Streetlights', 'Traffic signs']
    },
    {
      id: 'waste-management',
      name: 'Waste Management',
      head: 'Mr. John Smith',
      contactEmail: 'waste@solplaatje.gov.za',
      contactPhone: '+27 53 830 6913',
      responsibleFor: ['Refuse collection', 'Illegal dumping', 'Recycling', 'Landfill management']
    },
    {
      id: 'parks-recreation',
      name: 'Parks & Recreation',
      head: 'Ms. Nomsa Dlamini',
      contactEmail: 'parks@solplaatje.gov.za',
      contactPhone: '+27 53 830 6914',
      responsibleFor: ['Parks maintenance', 'Sports facilities', 'Community centers', 'Playgrounds']
    },
    {
      id: 'public-safety',
      name: 'Public Safety',
      head: 'Mr. David Williams',
      contactEmail: 'safety@solplaatje.gov.za',
      contactPhone: '+27 53 830 6915',
      responsibleFor: ['Emergency response', 'Traffic management', 'Public order', 'Disaster management']
    }
  ],
  fleetVehicles: [
    {
      id: 'SOL-001',
      registration: 'NC 123 ABC',
      type: 'maintenance-truck',
      status: 'available',
      department: 'roads-infrastructure',
      lastMaintenance: '2024-01-15',
      currentLocation: 'Depot A'
    },
    {
      id: 'SOL-002',
      registration: 'NC 456 DEF',
      type: 'waste-collection',
      status: 'dispatched',
      department: 'waste-management',
      assignedTo: 'Crew Team 1',
      lastMaintenance: '2024-01-10',
      currentLocation: 'Galeshewe Route'
    },
    {
      id: 'SOL-003',
      registration: 'NC 789 GHI',
      type: 'water-tanker',
      status: 'maintenance',
      department: 'water-sanitation',
      lastMaintenance: '2024-01-20',
      currentLocation: 'Workshop'
    }
  ],
  contactInfo: {
    mainOffice: '+27 53 830 6911',
    emergencyLine: '+27 53 830 6999',
    email: 'info@solplaatje.gov.za',
    website: 'www.solplaatje.gov.za',
    address: 'Civic Centre, Beaconsfield, Kimberley, 8301'
  }
};

export const NORTHERN_CAPE_MUNICIPALITIES = [
  'Sol Plaatje Local Municipality',
  'Dikgatlong Local Municipality',
  'Magareng Local Municipality',
  'Phokwane Local Municipality',
  'Joe Morolong Local Municipality',
  '!Kheis Local Municipality',
  'Tsantsabane Local Municipality',
  'Kgatelopele Local Municipality',
  'Ubuntu Local Municipality',
  'Umsobomvu Local Municipality',
  'Emthanjeni Local Municipality',
  'Kareeberg Local Municipality',
  'Renosterberg Local Municipality',
  'Thembelihle Local Municipality',
  'Siyathemba Local Municipality',
  'Siyancuma Local Municipality',
  'Mier Local Municipality',
  'Kai !Garib Local Municipality',
  'Khâi-Ma Local Municipality',
  'Nama Khoi Local Municipality',
  'Kamiesberg Local Municipality',
  'Hantam Local Municipality',
  'Karoo Hoogland Local Municipality',
  'Richtersveld Local Municipality',
  'Dawid Kruiper Local Municipality',
  'Pixley Ka Seme District Municipality',
  'Frances Baard District Municipality',
  'Namakwa District Municipality',
  'ZF Mgcawu District Municipality',
  'John Taolo Gaetsewe District Municipality'
];

// Cape Town Metropolitan Municipality
const CAPE_TOWN_MUNICIPALITY: Municipality = {
  id: 'cape-town-metro',
  name: 'City of Cape Town Metropolitan Municipality',
  province: 'Western Cape',
  wards: Array.from({ length: 116 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Ms. Jennifer Adams',
      contactEmail: 'water@capetown.gov.za',
      contactPhone: '+27 21 400 4000',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    },
    {
      id: 'roads-infrastructure',
      name: 'Roads & Infrastructure',
      head: 'Mr. Michael Brown',
      contactEmail: 'roads@capetown.gov.za',
      contactPhone: '+27 21 400 4001',
      responsibleFor: ['Road maintenance', 'Potholes', 'Streetlights', 'Traffic signs']
    }
  ],
  fleetVehicles: []
};

// Johannesburg Metropolitan Municipality
const JOHANNESBURG_MUNICIPALITY: Municipality = {
  id: 'johannesburg-metro',
  name: 'City of Johannesburg Metropolitan Municipality',
  province: 'Gauteng',
  wards: Array.from({ length: 135 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Mr. Peter Molefe',
      contactEmail: 'water@joburg.org.za',
      contactPhone: '+27 11 407 6000',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    },
    {
      id: 'roads-infrastructure',
      name: 'Roads & Infrastructure',
      head: 'Ms. Lisa Maharaj',
      contactEmail: 'roads@joburg.org.za',
      contactPhone: '+27 11 407 6001',
      responsibleFor: ['Road maintenance', 'Potholes', 'Streetlights', 'Traffic signs']
    }
  ],
  fleetVehicles: []
};

// eThekwini Metropolitan Municipality (Durban)
const ETHEKWINI_MUNICIPALITY: Municipality = {
  id: 'ethekwini-metro',
  name: 'eThekwini Metropolitan Municipality',
  province: 'KwaZulu-Natal',
  wards: Array.from({ length: 111 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Mr. Sipho Ndlovu',
      contactEmail: 'water@durban.gov.za',
      contactPhone: '+27 31 311 1111',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    }
  ],
  fleetVehicles: []
};

// Tshwane Metropolitan Municipality (Pretoria)
const TSHWANE_MUNICIPALITY: Municipality = {
  id: 'tshwane-metro',
  name: 'City of Tshwane Metropolitan Municipality',
  province: 'Gauteng',
  wards: Array.from({ length: 215 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Ms. Themba Mthembu',
      contactEmail: 'water@tshwane.gov.za',
      contactPhone: '+27 12 358 9999',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    }
  ],
  fleetVehicles: []
};

// Ekurhuleni Metropolitan Municipality
const EKURHULENI_MUNICIPALITY: Municipality = {
  id: 'ekurhuleni-metro',
  name: 'Ekurhuleni Metropolitan Municipality',
  province: 'Gauteng',
  wards: Array.from({ length: 112 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Mr. James Sithole',
      contactEmail: 'water@ekurhuleni.gov.za',
      contactPhone: '+27 11 999 0000',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    }
  ],
  fleetVehicles: []
};

// Nelson Mandela Bay Municipality (Port Elizabeth)
const NELSON_MANDELA_BAY_MUNICIPALITY: Municipality = {
  id: 'nelson-mandela-bay',
  name: 'Nelson Mandela Bay Metropolitan Municipality',
  province: 'Eastern Cape',
  wards: Array.from({ length: 120 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Ms. Patricia Johnson',
      contactEmail: 'water@mandelametro.gov.za',
      contactPhone: '+27 41 506 3000',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    }
  ],
  fleetVehicles: []
};

// Buffalo City Municipality (East London)
const BUFFALO_CITY_MUNICIPALITY: Municipality = {
  id: 'buffalo-city',
  name: 'Buffalo City Metropolitan Municipality',
  province: 'Eastern Cape',
  wards: Array.from({ length: 50 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Mr. Mandla Mafanya',
      contactEmail: 'water@buffalocity.gov.za',
      contactPhone: '+27 43 705 2000',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    }
  ],
  fleetVehicles: []
};

// Mangaung Metropolitan Municipality (Bloemfontein)
const MANGAUNG_MUNICIPALITY: Municipality = {
  id: 'mangaung-metro',
  name: 'Mangaung Metropolitan Municipality',
  province: 'Free State',
  wards: Array.from({ length: 45 }, (_, i) => ({
    number: i + 1,
    name: `Ward ${i + 1}`,
    areas: [`Area ${i + 1}A`, `Area ${i + 1}B`, `Area ${i + 1}C`]
  })),
  departments: [
    {
      id: 'water-sanitation',
      name: 'Water & Sanitation',
      head: 'Ms. Dineo Molefe',
      contactEmail: 'water@mangaung.co.za',
      contactPhone: '+27 51 405 8000',
      responsibleFor: ['Water supply', 'Sewage management', 'Water quality', 'Pipe maintenance']
    }
  ],
  fleetVehicles: []
};

// Export array of all municipalities
export const SOUTH_AFRICAN_MUNICIPALITIES: Municipality[] = [
  SOL_PLAATJE_MUNICIPALITY,
  CAPE_TOWN_MUNICIPALITY,
  JOHANNESBURG_MUNICIPALITY,
  ETHEKWINI_MUNICIPALITY,
  TSHWANE_MUNICIPALITY,
  EKURHULENI_MUNICIPALITY,
  NELSON_MANDELA_BAY_MUNICIPALITY,
  BUFFALO_CITY_MUNICIPALITY,
  MANGAUNG_MUNICIPALITY
];

export const MUNICIPAL_ISSUE_CATEGORIES = [
  {
    id: 'water-sanitation',
    name: 'Water & Sanitation',
    subcategories: ['Water supply issues', 'Burst pipes', 'Low water pressure', 'Water quality concerns', 'Sewage overflow', 'Blocked drains'],
    department: 'water-sanitation',
    expectedResolution: '2-7 days'
  },
  {
    id: 'roads-infrastructure',
    name: 'Roads & Infrastructure',
    subcategories: ['Potholes', 'Broken streetlights', 'Damaged road signs', 'Traffic light malfunction', 'Broken sidewalks', 'Bridge maintenance'],
    department: 'roads-infrastructure',
    expectedResolution: '3-14 days'
  },
  {
    id: 'waste-management',
    name: 'Waste Management',
    subcategories: ['Illegal dumping', 'Missed refuse collection', 'Overflowing bins', 'Broken refuse bins', 'Hazardous waste', 'Recycling issues'],
    department: 'waste-management',
    expectedResolution: '1-5 days'
  },
  {
    id: 'parks-recreation',
    name: 'Parks & Recreation',
    subcategories: ['Damaged playground equipment', 'Broken benches', 'Overgrown vegetation', 'Damaged sports facilities', 'Graffiti removal', 'Park lighting'],
    department: 'parks-recreation',
    expectedResolution: '5-14 days'
  },
  {
    id: 'public-safety',
    name: 'Public Safety',
    subcategories: ['Emergency response', 'Fire safety', 'Traffic safety', 'Public disturbances', 'Animal control', 'Security concerns', 'Theft of municipal property', 'Vandalism/Property damage', 'Cable theft', 'Infrastructure vandalism', 'Copper theft', 'Street light vandalism'],
    department: 'public-safety',
    expectedResolution: '1-3 days'
  },
  {
    id: 'housing',
    name: 'Housing',
    subcategories: ['RDP housing issues', 'Housing maintenance', 'Housing applications', 'Informal settlement concerns', 'Property disputes', 'Building permits'],
    department: 'housing',
    expectedResolution: '7-30 days'
  },
  {
    id: 'crime-security',
    name: 'Crime & Security',
    subcategories: ['Theft of municipal property', 'Vandalism of public property', 'Cable theft', 'Copper theft', 'Street light vandalism', 'Graffiti on municipal buildings', 'Damage to municipal infrastructure', 'Break-ins at municipal facilities', 'Theft from parks/recreational areas', 'Vehicle theft/break-ins in municipal areas'],
    department: 'public-safety',
    expectedResolution: '24-48 hours'
  }
];

// Helper function to get municipality by ID
export const getMunicipalityById = (id: string): Municipality | undefined => {
  return SOUTH_AFRICAN_MUNICIPALITIES.find(municipality => municipality.id === id);
};

// Helper function to get wards by municipality ID
export const getWardsByMunicipality = (municipalityId: string): Ward[] => {
  const municipality = getMunicipalityById(municipalityId);
  return municipality?.wards || [];
};

// Reference number generation
export const generateReferenceNumber = (category: string, ward: string): string => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  const categoryCode = category.split('-')[0].toUpperCase().substring(0, 2);
  const wardCode = String(ward).padStart(2, '0');
  
  return `SPM-${year}${month}${day}-W${wardCode}-${categoryCode}${random}`;
}; 