import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  useDisclosure,
  Select,
  FormErrorMessage,
} from "@chakra-ui/react";

import { Input } from "../Input";

import { useEffect, useState } from "react";

import { api } from "../../services/api";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { petFormSchema } from "../../utils/yup/schema";

export default function PetList() {
  const [pets, setPets] = useState([]);
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();
  const {
    isOpen: isEditAlertOpen,
    onOpen: onEditAlertOpen,
    onClose: onEditAlertClose,
  } = useDisclosure();
  const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
  const [itemToBeEdited, setItemToBeEdited] = useState(null);

  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(petFormSchema),
  });

  useEffect(() => {
    api.get("/pets").then((res) => {
      setPets(res.data);
    });
  }, []);

  function handleDeletePet() {
    api
      .delete(`pets/${itemToBeDeleted}`)
      .then(() => {
        let newPetArray = pets.filter((pet) => pet.id !== itemToBeDeleted);
        setPets(newPetArray);
        setItemToBeDeleted(null);
        onDeleteAlertClose();
      })
      .catch(() => alert("Error: Could not delete pet"));
  }

  const handleEditPet = async (values) => {
    await api
      .put(`/pets/${itemToBeEdited.id}`, {
        ...values,
      })
      .then((res) => {
        onEditAlertClose();
        const newPetArray = pets.filter((pet) => pet.id === itemToBeEdited.id);
        setPets([...newPetArray, { ...values, id: itemToBeEdited.id }]);
        setItemToBeEdited(null);
      });
  };

  function handleOpenDeletePetAlert(id) {
    onDeleteAlertOpen();
    setItemToBeDeleted(id);
  }

  function handleCloseDeletePetAlert() {
    onDeleteAlertClose();
    setItemToBeDeleted(null);
  }

  function handleOpenEditPetAlert(pet) {
    onEditAlertOpen();
    setItemToBeEdited(pet);
  }

  function handleCloseEditPetAlert() {
    onEditAlertClose();
    setItemToBeEdited(null);
    reset();
  }

  return (
    <>
      <Modal isOpen={isEditAlertOpen} onClose={handleCloseEditPetAlert}>
        <ModalOverlay />
        <ModalContent bg={"#1a202c"}>
          <ModalHeader color={"white"}>Edit Pet</ModalHeader>
          <ModalCloseButton color={"white"} />
          <ModalBody>
            <Box
              as="form"
              id="edit-pet-form"
              flex="1"
              borderRadius={8}
              bg="gray.800"
              onSubmit={handleSubmit(handleEditPet)}
            >
              <VStack spacing="8">
                <Flex gap="3">
                  <Input
                    label="Name"
                    placeholder={itemToBeEdited?.name}
                    error={errors.name}
                    {...register("name")} // in the new version this already add the "name" input property
                  />
                  <Input
                    label="Type"
                    placeholder={itemToBeEdited?.type}
                    error={errors.type}
                    {...register("type")}
                  />
                </Flex>
                <Flex gap="3">
                  <Input
                    placeholder={itemToBeEdited?.age}
                    label="Age"
                    error={errors.age}
                    {...register("age")}
                  />
                  <Input
                    placeholder={itemToBeEdited?.weight}
                    label="Weight"
                    error={errors.weight}
                    {...register("weight")}
                  />
                </Flex>
                <Flex gap="3">
                  <Box>
                    <Text color={"gray"} mb="2">
                      Docile
                    </Text>
                    <Select
                      placeholder={"Select an option"}
                      bg={"white"}
                      color={"black"}
                      {...register("isDocile")}
                    >
                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </Select>
                    {!!errors.isDocile && (
                      <FormErrorMessage>
                        {errors.isDocile.message}
                      </FormErrorMessage>
                    )}
                  </Box>
                  <Input
                    label="Caregiver Name"
                    placeholder={itemToBeEdited?.caregiverName}
                    error={errors.caregiverName}
                    {...register("caregiverName")}
                  />
                </Flex>
              </VStack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              id="edit-pet-form"
              onClick={handleSubmit(handleEditPet)}
              // Isso é necessario para fazer o submit com o botão fora do form

              isLoading={isSubmitting}
            >
              Save
            </Button>
            <Button colorScheme="whiteAlpha" onClick={handleCloseEditPetAlert}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteAlertOpen} onClose={handleCloseDeletePetAlert}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Warning!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              This is a permanent operation are you sure you want to proceed
              with the deletion of this pet?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDeletePet()}>
              Delete
            </Button>
            <Button variant="ghost" onClick={handleCloseDeletePetAlert}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box>
        <Flex w="100%" px="6">
          <Box flex="1" borderRadius={8} bg="gray.800" p="8">
            <Flex mb="8" justify="space-between" align="center">
              <Heading size="lg" fontWeight="normal">
                Pets
              </Heading>

              <Link href="/pets/create">
                <Button size="md" fontSize="sm" colorScheme="green">
                  Create new pet
                </Button>
              </Link>
            </Flex>
            <Table colorScheme="whiteAlpha" color={"white"} size={"sm"}>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Age</Th>
                  <Th>Weight</Th>
                  <Th>Caregiver name</Th>
                  <Th>Docile</Th>
                  <Th w="8"></Th>
                </Tr>
              </Thead>

              <Tbody>
                {pets.map((pet) => {
                  return (
                    <Tr key={pet.id}>
                      <Td>
                        <Link color="green.400">
                          <Text fontWeight="bold">{pet.name}</Text>
                        </Link>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.300">
                          {pet.type}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.300">
                          {pet.age}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.300">
                          {pet.weight}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.300">
                          {pet.caregiverName}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.300">
                          {pet.isDocile ? "Yes" : "No"}
                        </Text>
                      </Td>
                      <Td>
                        <Flex gap="2">
                          <Button
                            size="sm"
                            fontSize="sm"
                            colorScheme="green"
                            onClick={() => handleOpenEditPetAlert(pet)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            fontSize="sm"
                            colorScheme="red"
                            onClick={() => handleOpenDeletePetAlert(pet.id)}
                          >
                            Remove
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
