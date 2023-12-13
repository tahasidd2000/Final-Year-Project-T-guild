import React from "react";
import { FormikProps } from "formik";
import { Input, Typography, InputProps } from "@mui/material";
import { RowBetween } from "../Row";
import { lightColors } from "../../theme/colors";
import { Box } from "../Box";

export interface StandardTokenValues {
  name?: string;
  symbol?: string;
  supply?: string;
  decimals?: string;
}

export interface LiquidityTokenValues {
  name?: string;
  symbol?: string;
  supply?: string;
  charityAddress?: string;
  taxFeeBps?: string;
  liquidityFeeBps?: string;
  charityFeeBps?: string;
  taxes?: string;
}

interface InputFieldProps {
  formik: FormikProps<StandardTokenValues> | FormikProps<LiquidityTokenValues>;
  message: string;
  label: string;
  inputAttributes: InputProps;
}

const InputFormik = ({
  formik,
  message,
  inputAttributes,
  label,
}: InputFieldProps) => {
  const propertyName = inputAttributes.name as keyof (
    | StandardTokenValues
    | LiquidityTokenValues
  );
  return (
    <Box width="100%">
      <label htmlFor={propertyName}>
        <RowBetween ml="3px" mb="5px" mt="20px">
          <Typography fontWeight="bold" fontSize="18px">
            {label}
          </Typography>
        </RowBetween>
        <Input
          sx={{ color: lightColors.textSubtle }}
          value={formik.values[propertyName]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name={propertyName}
          id={propertyName}
          fullWidth
          {...inputAttributes}
        />
      </label>
      <Typography
        style={{ height: "10px" }}
        ml="3px"
        mt="2px"
        fontSize="10px"
        color="#ED4B9E"
      >
        {formik.touched[propertyName] && formik.errors[propertyName]
          ? formik.errors[propertyName]
          : ""}
      </Typography>
    </Box>
  );
};

export default InputFormik;
