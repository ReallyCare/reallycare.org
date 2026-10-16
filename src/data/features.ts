// Plait feature descriptions. Wording is based on the old solutions page and the
// "So, what is Plait?" video. Don't add claims here that the product can't back up.

export interface Feature {
  id: string;
  icon: string;
  title: string;
  summary: string; // one line, for cards
  points: string[];
  image?: { src: string; alt: string };
}

export const officeFeatures: Feature[] = [
  {
    id: 'scheduling',
    icon: '📅',
    title: 'Scheduling',
    summary: 'Rotas that are quick to build and change, with exports to payroll and your accounts system.',
    points: [
      'A modern scheduler that adapts to how your service works',
      'Recurring work patterns save office staff hours every week',
      'Exports to your payroll and accounts systems',
      'Fully linked to the point-of-care app, so changes reach care workers straight away',
    ],
    image: { src: '/img/location-on-popup.png', alt: 'A visit pop-up on the Plait rota showing the client, time and location' },
  },
  {
    id: 'care-planning',
    icon: '📋',
    title: 'Care planning',
    summary: 'Referral, assessment and published care plan in one flow. Care workers see the changes at the next visit.',
    points: [
      'Handle referrals, complete assessments and publish care plans in one process',
      'Fully configurable, with templates based on the PRSB About Me and Personalised Care and Support Plan standards',
      'Changes are highlighted to care workers at the point of care',
    ],
  },
  {
    id: 'emar',
    icon: '💊',
    title: 'Medication management (eMAR)',
    summary: 'Record medication at the point of care, with real-time alerts in the office if a dose is missed.',
    points: [
      'Manage client medication in the office and at the point of care',
      'Get alerts in the office if a medication is not administered, or if a monitored PRN medication is needed',
      'Real-time alerts, backed up by straightforward auditing',
    ],
  },
  {
    id: 'finance',
    icon: '💷',
    title: 'Payroll & invoicing',
    summary: 'Holiday pay, National Minimum Wage checks and flexible invoice layouts, exported to your accounts.',
    points: [
      'Invoices with completely flexible layouts',
      'Output to your accounts system',
      'Payroll with full holiday pay calculation',
      'Complete National Minimum Wage calculation',
    ],
  },
  {
    id: 'training-hr',
    icon: '🎓',
    title: 'Training, HR & reviews',
    summary: 'One-off and recurring training and staff reviews, with what is due next shown at a glance.',
    points: [
      'Record one-off and recurring training needs for every member of staff',
      'See upcoming requirements at a glance',
    ],
  },
  {
    id: 'recruitment',
    icon: '🧑‍💼',
    title: 'Recruitment',
    summary: 'Manage applicants and your whole recruitment workflow in one place.',
    points: ['An automated way to manage applicants and your whole recruitment workflow'],
  },
  {
    id: 'compliance',
    icon: '✅',
    title: 'Compliance & workflow',
    summary: 'Accidents, complaints, and anything else you currently track in a spreadsheet.',
    points: [
      'Record accidents and handle complaints',
      'A flexible, fully integrated way to handle anything else you currently keep in a spreadsheet',
    ],
  },
  {
    id: 'policies',
    icon: '📚',
    title: 'Policies & regulations',
    summary: 'Manage policies in one place and make them available to care workers on their phones.',
    points: ['Manage all your policies and regulations in one place', 'Care workers can read them in the point-of-care app'],
  },
  {
    id: 'messaging',
    icon: '💬',
    title: 'Secure messaging',
    summary: 'Messaging between the office and care workers, so client details stay with you, not on WhatsApp.',
    points: [
      'Secure messaging between the office and care workers, built into Plait and the point-of-care app',
      'Worried about where WhatsApp stores your messages? With Plait, you don’t need it',
      'When a care worker leaves, your messages about clients don’t leave with them',
    ],
  },
  {
    id: 'surveys',
    icon: '📊',
    title: 'Surveys',
    summary: 'Find out what your clients and care workers think of your service.',
    points: ['Run annual (or more frequent) surveys of clients and care workers', 'See the results in Plait'],
  },
];

export const pointOfCare = [
  {
    title: 'Care workers',
    text: 'See their rota and each client’s care plan, including recent changes, record medication and completed tasks, and message the office.',
  },
  {
    title: 'Clients and families',
    text: 'See upcoming visits and the records from past visits.',
  },
  {
    title: 'Paramedics',
    text: 'In an emergency, paramedics can quickly see medication records and recent comments. Every access is logged.',
  },
];
