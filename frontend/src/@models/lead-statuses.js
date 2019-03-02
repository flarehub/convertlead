import * as R from "ramda";

export const LeadStatuses = {
  NEW: {
    color: 'violet',
      icon: 'N',
  },
  VIEWED: {
    color: 'green',
      icon: 'V',
  },
  CONTACTED_SMS: {
    color: 'orange',
      icon: 'C',
  },
  CONTACTED_CALL: {
    color: 'orange',
      icon: 'C',
  },
  CONTACTED_EMAIL: {
    color: 'orange',
      icon: 'C',
  },
  MISSED: {
    color: 'red',
      icon: 'M',
  },
  BAD: {
    color: 'youtube',
      icon: 'B',
  },
  SOLD: {
    color: 'purple',
      icon: 'S',
  },
};

export const getSelectBoxStatuses = R.pipe(R.mapObjIndexed((object, status) => {
  return { key: status, text: status, value: status };
}), R.values)(LeadStatuses);