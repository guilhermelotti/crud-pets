import { forwardRef } from "react";

import {
  Input as ChakraInput,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

function InputBase({ name, label, error = null, ...rest }, ref) {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && (
        <FormLabel htmlFor={name} color={"gray"}>
          {label}
        </FormLabel>
      )}
      <ChakraInput
        id={name}
        name={name}
        color={"white"}
        focusBorderColor="green.500"
        bgColor="gray.900"
        variant="filled"
        _hover={{
          bgColor: "gray.900",
        }}
        size="lg"
        ref={ref}
        {...rest}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}

export const Input = forwardRef(InputBase);
// forward the refs defined in the parent component to the child component (React-Hook-Form make use of ref).
