import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";

export const Field = ({
  label,
  helperText,
  errorText,
  children,
  isInvalid,
}) => {
  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      {helperText && !errorText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
    </FormControl>
  );
};
