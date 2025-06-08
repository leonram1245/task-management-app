import {
  Box,
  Heading,
  Text,
  Stack,
  Card,
  CardBody,
  Spinner,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserTasks } from "../features/ui/taskSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { createdTasks, assignedTasks, loading, error } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    if (token) dispatch(fetchUserTasks(token));
  }, [dispatch, token]);

  if (loading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  return (
    <Box p={8} bg="#f7fafc" minH="100vh">
      <Stack spacing={10}>
        <Box>
          <Heading size="md" mb={2}>
            Your Created Tasks
          </Heading>
          <Stack spacing={3}>
            {createdTasks.length === 0 ? (
              <Text color="gray.500">No created tasks</Text>
            ) : (
              createdTasks.map((task) => (
                <Card key={task.id}>
                  <CardBody>
                    <Text fontWeight="bold">{task.title}</Text>
                    <Text>{task.description}</Text>
                  </CardBody>
                </Card>
              ))
            )}
          </Stack>
        </Box>

        <Box>
          <Heading size="md" mb={2}>
            Tasks Assigned to You
          </Heading>
          <Stack spacing={3}>
            {assignedTasks.length === 0 ? (
              <Text color="gray.500">No assigned tasks</Text>
            ) : (
              assignedTasks.map((task) => (
                <Card key={task.id}>
                  <CardBody>
                    <Text fontWeight="bold">{task.title}</Text>
                    <Text>{task.description}</Text>
                  </CardBody>
                </Card>
              ))
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
