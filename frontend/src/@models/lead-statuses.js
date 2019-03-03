import * as R from "ramda";

export const LeadStatuses = {
  NEW: {
    color: '#6435c9',
      icon: 'N',
  },
  VIEWED: {
    color: '#2cb3c8',
      icon: 'V',
  },
  CONTACTED_SMS: {
    color: '#f2711c',
      icon: 'C',
  },
  CONTACTED_CALL: {
    color: '#f2711c',
      icon: 'C',
  },
  CONTACTED_EMAIL: {
    color: '#f2711c',
      icon: 'C',
  },
  MISSED: {
    color: '#db2828',
      icon: 'M',
  },
  BAD: {
    color: '#db2828',
      icon: 'B',
  },
  SOLD: {
    color: '#21ba45',
      icon: 'S',
  },
};

export const getSelectBoxStatuses = R.pipe(R.mapObjIndexed((object, status) => {
  return { key: status, text: status, value: status };
}), R.values)(LeadStatuses);