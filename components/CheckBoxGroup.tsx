
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormLabel, FormControlLabel, Checkbox } from '@mui/material';

interface CheckBoxGroupProps {
  label: string;
  name?: string;
  options: string[];
  [key: string]: any;
}

const CheckBoxGroup: React.FC<CheckBoxGroupProps> = ({ label, name, options, ...props }) => {
  const { control, formState: { errors } } = useFormContext();

  name = name || label;

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={<Checkbox {...field} value={option} />}
                label={option}
              />
            ))}
          </div>
        )}
        {...props}
      />
      {!!errors[name] && <div style={{ color: 'red' }}>{(errors[name] as any)?.message}</div>}
    </FormControl>
  );
};

export default CheckBoxGroup;
