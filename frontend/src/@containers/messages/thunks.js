import { toast } from 'react-toastify';

export const sendMessage = (message, error = false) => (dispatch) => {
  if (error) {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  } else {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }
};

export const sendMessageInfo = message => (dispatch) => {
  toast.info(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};


export const sendMessageWarn = message => (dispatch) => {
  toast.warn(message, {
    position: toast.POSITION.TOP_RIGHT,
  });
};
