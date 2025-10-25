import axios from 'axios';

export const handelError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 500) {
      console.error('500 error');
    } else if (status === 401) {
      console.error('401 error');
    } else {
      console.error('unknown error');
    }
  }

  console.error(error);
};
