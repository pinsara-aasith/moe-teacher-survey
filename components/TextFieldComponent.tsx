import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, TextField } from '@mui/material';

interface TextFieldComponentProps {
  label: string;
  name?: string;
  [key: string]: any; // to capture additional props
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({ label, name, ...props }) => {
  const { control, formState: {errors} } = useFormContext();

  return (
    <FormControl variant="filled" fullWidth>
      <Controller
        name={name || label}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            label={label}
            fullWidth
            {...props}
            {...field}
            error={!!errors[name || label]}
            helperText={(errors[name || label]?.message) as string}
          />
        )}
      />
    </FormControl>
  );
};

export default TextFieldComponent;
