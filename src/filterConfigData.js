const filterConfig = [
  {
    label: 'Selected',
    name: 'selected',
    cql: 'selected',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' }
    ],
  },
  {
    label: 'Free Content?',
    name: 'freeContent',
    cql: 'freeContent',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' },
      { name: 'Undetermined', cql: 'undetermined' }
    ],
  },
  {
    label: 'Permitted',
    name: 'permitted',
    cql: 'permitted',
    values: [
      { name: 'Yes', cql: 'yes' },
      { name: 'No', cql: 'no' }
    ],
  },
  {
    label: 'Source',
    name: 'mdSource',
    cql: 'mdSource',
    values: [],
  },
  {
    label: 'Status',
    name: 'status',
    cql: 'status',
    values: [
      {
        name: 'Unassigned',
        cql: 'unassigned',
        value: false
      },
      {
        name: 'Assigned',
        cql: 'assigned',
        value: false
      }
    ],
  }
];

export default filterConfig;
