import { useSnackbar, OptionsObject, VariantType } from 'notistack';

interface ShowSnackbarOptions extends OptionsObject {
  variant?: VariantType;
}

const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message: string, options: ShowSnackbarOptions = {}, variant: VariantType) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
      autoHideDuration: 2000,
      ...options,
    });
  };

  const showSnackbarError = (message: string, options: ShowSnackbarOptions = {}) => {
    showSnackbar(message, options, 'error');
  };

  const showSnackbarSuccess = (message: string, options: ShowSnackbarOptions = {}) => {
    showSnackbar(message, options, 'success');
  };

  return { showSnackbar, showSnackbarError, showSnackbarSuccess };
};

export default useToast;
