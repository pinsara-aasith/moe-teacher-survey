/* eslint-disable unused-imports/no-unused-vars */
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Controller, useFormContext } from "react-hook-form";

interface SelectFieldProps {
  label: string;
  options: string[];
  name?: string;
  disabled?: boolean;
  multiple?: boolean;
  renderValue?: (selected: any) => React.ReactNode;
  renderMenuItem?: (option: string) => React.ReactNode;
  [key: string]: any; // Allow any additional props
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  name,
  disabled = false,
  multiple = false,
  renderValue,
  renderMenuItem,
  ...props
}) => {
  const { control, formState: {errors} } = useFormContext();

  const { t } = useTranslation();

  // Use the label as the default name if none is provided
  name = name || label;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <FormControl fullWidth error={!!errors[name]} {...props}>
          <InputLabel id={`${name}-label`}>{t(label)}</InputLabel>
          <Select
            labelId={`${name}-label`}
            label={t(label)}
            {...field}
            disabled={disabled}
            multiple={multiple}
            renderValue={renderValue}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {renderMenuItem ? renderMenuItem(option) : t(option)}
              </MenuItem>
            ))}
          </Select>
          {!!errors[name] && (
            <div style={{ color: 'red' }}>{(errors as any)[name]?.message}</div>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectField