
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup } from '@mui/material';
interface RadioButtonGroupProps {
  label: string;
  name: string;
  options: string[];
  [key: string]: any; // to capture additional props
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ label, name, options, ...props }) => {
  const { control, formState: {errors} } = useFormContext();

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <RadioGroup {...field} row aria-label={label} name={label}>
            {options.map((option) => (
              <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
            ))}
          </RadioGroup>
        )}
        {...props}
      />
      {!!errors[name] && <div style={{ color: 'red' }}>{(errors[name] as any)?.message}</div>}
    </FormControl>
  );
};

export default RadioButtonGroup;