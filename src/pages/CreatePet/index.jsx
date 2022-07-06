import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Select,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";

import { useForm, SubmitHandler } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { petFormSchema } from "../../utils/yup/schema";

import { api } from "../../services/api";

import { v4 as uuid } from "uuid";
import { Input } from "../../components/Input";

export function CreatePet() {
  let navigate = useNavigate();

  const createPet = async (pet) => {
    await api.post("pets", {
      ...pet,
      id: uuid(),
    });
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(petFormSchema),
  });

  const handleCreatePet = async (values) => {
    await createPet(values);

    navigate("/", { replace: true });
  };

  return (
    <Box>
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleCreatePet)}
        >
          <Heading size="lg" fontWeight="normal" color={"white"}>
            Criar pet
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                label="Name"
                error={errors.name}
                {...register("name")} // in the new version this already add the "name" input property
              />
              <Input label="Type" error={errors.type} {...register("type")} />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input label="Age" error={errors.age} {...register("age")} />
              <Input
                label="Weight"
                error={errors.weight}
                {...register("weight")}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Box>
                <Text color={"gray"} mb="2">
                  Docile
                </Text>
                <Select
                  placeholder="Select an option"
                  bg={"white"}
                  color={"black"}
                  {...register("isDocile")}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </Select>
                {!!errors.isDocile && (
                  <FormErrorMessage>{errors.isDocile.message}</FormErrorMessage>
                )}
              </Box>
              <Input
                label="Caregiver Name"
                error={errors.caregiverName}
                {...register("caregiverName")}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Button
                type="submit"
                colorScheme="green"
                isLoading={isSubmitting}
              >
                Create
              </Button>
              <Link to="/">
                <Button colorScheme="whiteAlpha">Cancel</Button>
              </Link>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
