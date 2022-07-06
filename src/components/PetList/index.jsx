import {
  Box,
  Button,
  Flex,
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
  FormControl,
  Input,
} from "@chakra-ui/react";

import { Input as StyledInput } from "../Input";

import { useEffect, useState } from "react";

import { api } from "../../services/api";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { petFormSchema } from "../../utils/yup/schema";
import { useDebounce } from "../../hooks/useDebounce";

export default function PetList() {
  const [pets, setPets] = useState([]);
  const [itemToBeDeleted, setItemToBeDeleted] = useState(null);
  const [itemToBeEdited, setItemToBeEdited] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);

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

  const debouncedSearch = useDebounce(searchTerm, 600);

  const {
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(petFormSchema),
  });

  useEffect(() => {
    if (debouncedSearch.length <= 0) {
      api.get("/pets").then((res) => {
        setPets(res.data);
      });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedSearch.length > 0) {
      setIsLoadingSearchResults(true);
      switch (searchBy) {
        case "name":
          api.get(`/pets?name=${debouncedSearch}`).then((res) => {
            setPets(res.data);
            setIsLoadingSearchResults(false);
          });
          break;
        case "caregiverName":
          api.get(`/pets?caregiverName=${debouncedSearch}`).then((res) => {
            setPets(res.data);
            setIsLoadingSearchResults(false);
          });
          break;
        case "type":
          api.get(`/pets?type=${debouncedSearch}`).then((res) => {
            setPets(res.data);
            setIsLoadingSearchResults(false);
          });
          break;
        default:
          setIsLoadingSearchResults(false);
          alert(`No select option selected.`);
      }
    }
  }, [debouncedSearch, searchBy]);

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

  function handleEditPet(values) {
    api
      .put(`/pets/${itemToBeEdited.id}`, {
        ...values,
      })
      .then((res) => {
        onEditAlertClose();
        const newPetArray = pets.filter((pet) => pet.id !== itemToBeEdited.id);
        setPets([...newPetArray, { ...values, id: itemToBeEdited.id }]);
        setItemToBeEdited(null);
      });
  }

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

  function clearSearchFilters() {
    setSearchBy("name");
    setSearchTerm("");
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
                  <StyledInput
                    label="Name"
                    placeholder={itemToBeEdited?.name}
                    error={errors.name}
                    {...register("name")}
                  />
                  <StyledInput
                    label="Type"
                    placeholder={itemToBeEdited?.type}
                    error={errors.type}
                    {...register("type")}
                  />
                </Flex>
                <Flex gap="3">
                  <StyledInput
                    placeholder={itemToBeEdited?.age}
                    label="Age"
                    error={errors.age}
                    {...register("age")}
                  />
                  <StyledInput
                    placeholder={itemToBeEdited?.weight}
                    label="Weight"
                    error={errors.weight}
                    {...register("weight")}
                  />
                </Flex>
                <Flex gap="3">
                  <FormControl isInvalid={!!errors.isDocile}>
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
                  </FormControl>
                  <StyledInput
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
              <Flex
                as="form"
                alignItems={"center"}
                justifyContent={"center"}
                gap={"3"}
              >
                {searchBy !== "type" && (
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bgColor="white"
                  />
                )}
                {searchBy === "type" && (
                  <Select
                    bg={"white"}
                    color={"black"}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  >
                    <option value="Hamster">Hamster</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                  </Select>
                )}
                <Select
                  bg={"white"}
                  color={"black"}
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                >
                  <option value="name">Pet name</option>
                  <option value="caregiverName">Caregiver name</option>
                  <option value="type">Pet type</option>
                </Select>
                <Button onClick={clearSearchFilters}>Clear</Button>
              </Flex>

              <Link href="/pets/create">
                <Button size="md" fontSize="sm" colorScheme="green">
                  Create new pet
                </Button>
              </Link>
            </Flex>
            {isLoadingSearchResults ? (
              <Text color={"white"}>Loading</Text>
            ) : (
              <>
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
                    {pets.length > 0 &&
                      pets.map((pet) => {
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
                                {pet.weight}kg
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
                                  onClick={() =>
                                    handleOpenDeletePetAlert(pet.id)
                                  }
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
                {pets.length <= 0 && <Text color={"white"}>No pets found</Text>}
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}
