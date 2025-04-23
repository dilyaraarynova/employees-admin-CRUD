import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { baseUrl } from "../../../constants/global-variable.js";
import toast from "react-hot-toast";
import { queryClient } from "../../../utils/queryClient.js";
import InputEmployee from "./InputEmployee.jsx";

const EmployeeTable = ({ data }) => {
  if (!data.length) {
    return <h1>You don't have any employee data</h1>;
  }

  const mutation = useMutation({
    mutationFn: async (id) => {
      console.log("mutation function: ", id);
      const response = await fetch(baseUrl + "/" + id, {
        method: "DELETE",
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
      console.log(error.message);
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Employee details deleted!");
      queryClient.invalidateQueries({ queryKey: ["employee_details"] });
    },
  });

  return (
    <Stack gap="10" p={4}>
      {
        <Table key={"simple"} size="md" variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Age</Th>
              <Th>Salary</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.email}</Td>
                <Td>{item.age}</Td>
                <Td>{item.salary}</Td>
                <Td>
                  <HStack gap="3">
                    <MdDelete
                      size={20}
                      className="icon"
                      onClick={() => mutation.mutate(item.id)}
                    />
                    <InputEmployee editData={item}>
                      <MdEdit size={20} className="icon" />
                    </InputEmployee>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      }
    </Stack>
  );
};

export default EmployeeTable;
