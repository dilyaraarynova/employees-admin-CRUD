import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Field } from "./field.jsx";
import { useState, cloneElement, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../../../constants/global-variable.js";
import { queryClient } from "../../../utils/queryClient.js";

function InputEmployee({ children, editData = null }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({
    name: editData?.name || "",
    email: editData?.email || "",
    age: editData?.age || "",
    salary: editData?.salary || "",
  });

  useEffect(() => {
    if (editData) {
      setInfo({
        name: editData.name || "",
        email: editData.email || "",
        age: editData.age || "",
        salary: editData.salary || "",
      });
    }
  }, [editData]);

  function handleChange(e) {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  console.log(info);

  const AddMutation = useMutation({
    mutationFn: async (info) => {
      const response = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setInfo({
        name: "",
        email: "",
        age: "",
        salary: "",
      });
      onClose();
      toast.success("Employee details added!");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(baseUrl + "/" + id, {
        method: "PUT",
        body: JSON.stringify(info),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setInfo({
        name: "",
        email: "",
        age: "",
        salary: "",
      });
      onClose();
      toast.success("Employee details updated!");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
  });

  const requiredFields = ["name", "age", "salary", "email"];
  function handleSubmit() {
    for (const key of requiredFields) {
      if (!info[key].toString().trim()) {
        toast.error("Missing fields!");
        return;
      }
    }
    if (editData?.id) {
      updateMutation.mutate(editData.id);
    } else {
      AddMutation.mutate(info);
    }
  }

  return (
    <>
      {children ? (
        cloneElement(children, { onClick: onOpen })
      ) : (
        <Button onClick={onOpen}>Add Employee</Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editData ? "Edit" : "Add"} Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap="4" align-item="flex-start">
              <Field label="Username" required>
                <Input
                  name="name"
                  placeholder="Enter username"
                  value={info.name}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Email" required>
                <Input
                  name="email"
                  placeholder="Enter email"
                  value={info.email}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Age" required>
                <Input
                  name="age"
                  placeholder="Enter age"
                  type="number"
                  value={info.age}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Salary" required>
                <Input
                  name="salary"
                  placeholder="Enter salary"
                  type="number"
                  value={info.salary}
                  onChange={handleChange}
                />
              </Field>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InputEmployee;
