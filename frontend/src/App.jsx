import React from "react";
import EmployeeTable from "./components/ui/EmployeeTable.jsx";
import { VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { baseUrl } from "../constants/global-variable.js";
import InputEmployee from "./components/ui/InputEmployee.jsx";
import { Button } from "@chakra-ui/react";

const App = () => {
  async function fetchEmployeeDetails(params) {
    const res = await fetch(baseUrl);
    const data = await res.json();
    // we will get the errors we added in the backend (reg database)
    if (!res.ok) {
      throw new Error(data.error);
    }
    return data;
  }
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["employee_details"],
    queryFn: fetchEmployeeDetails,
  });

  if (isPending) return "Loading";

  if (isError) return error.message;

  console.log("data from postgress db:", data);

  return (
    <VStack gap="6" align="flex-start">
      <InputEmployee>
        <Button>Add Employee</Button>
      </InputEmployee>
      <EmployeeTable data={data} />
    </VStack>
  );
};

export default App;
