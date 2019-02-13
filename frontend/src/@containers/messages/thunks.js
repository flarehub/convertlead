import { toast } from 'react-toastify';

export const sendMessage = (message, error = false) => {
  return dispatch => {
    if (error) {
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    } else {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }
};

export const sendMessageInfo = (message) => {
  return dispatch => {
    toast.info(message, {
      position: toast.POSITION.TOP_RIGHT
    })
  }
};


export const sendMessageWarn = (message) => {
  return dispatch => {
    toast.warn(message, {
      position: toast.POSITION.TOP_RIGHT
    })
  }
};

