const initState = {
  zapier: {
    api_callback: '',
    fields: [
      {
        name: 'fullname',
        type: 'string',
      },
      {
        name: 'phone',
        type: 'string'
      },
      {
        name: 'email',
        type: 'string'
      }
    ]
  },
  facebook: {
  },
  optinForm: {
    fullname: {
      label: 'Full name',
      placeholder: 'Full name',
      value: ''
    },
    phone: {
      label: 'Phone',
      placeholder: 'Phone',
      value: '',
    },
    email: {
      label: 'E-mail',
      placeholder: 'E-mail',
      value: '',
    },
    button: {
      name: 'Subscribe',
    }
  }
};

const integrations = (state = initState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default integrations;