import {
  Box,
  Heading,
  Text,
  Stack,
  Spinner,
  Input,
  Button,
  Center,
  Fieldset,
  Field,
  Flex,
  Dialog,
  For,
  Portal,
  Select,
  createListCollection,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchUserTasks,
  createTaskThunk,
  updateTaskThunk,
} from "../features/taskSlice";
import {
  searchUsers,
  clearSuggestions,
  fetchAllUsers,
} from "../features/userSlice";
import { useDebounce } from "use-debounce";
import { toaster } from "../components/ui/toaster";
import { TASK } from "../constants/constants";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const {
    createdTasks = [],
    assignedTasks = [],
    loading,
    error,
  } = useSelector((state) => state.tasks);
  const { suggestions = [], allUsers = [] } = useSelector(
    (state) => state.userSearch || {}
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedToId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "TODO",
  });
  const taskViewOptions = createListCollection({
    items: TASK.TASK_VIEW_OPTIONS,
  });
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState({ title: "", assignedTo: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskView, setTaskView] = useState(["created"]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserTasks(token));
      dispatch(fetchAllUsers());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchUsers(debouncedQuery.trim()));
    } else {
      dispatch(clearSuggestions());
    }
  }, [debouncedQuery, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "title" && !value.trim()) {
      setFormError((prev) => ({
        ...prev,
        title: TASK.TITLE_REQUIRED,
      }));
    }

    if (name === "search") {
      const isValidUser = allUsers.some((u) => u.id === form.assignedToId);
      if (!form.assignedToId || !isValidUser) {
        setFormError((prev) => ({
          ...prev,
          assignedTo: TASK.ASSIGNEDTO_REQUIRED,
        }));
      }
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError({ title: "", assignedTo: "" });

    let hasError = false;
    if (!form.title.trim()) {
      setFormError((prev) => ({ ...prev, title: TASK.TITLE_REQUIRED }));
      hasError = true;
    }
    const isValidUser = allUsers.some((u) => u.id === form.assignedToId);
    if (!form.assignedToId || !isValidUser) {
      setFormError((prev) => ({
        ...prev,
        assignedTo: TASK.ASSIGNEDTO_REQUIRED,
      }));
      hasError = true;
    }
    if (hasError || !token || !user) return;
    setCreating(true);
    try {
      await dispatch(
        createTaskThunk({
          taskData: { ...form, assignedById: user.id, status: "TODO" },
          token,
        })
      ).unwrap();

      setForm({ title: "", description: "", assignedToId: "" });
      setQuery("");
      dispatch(fetchUserTasks(token));
      toaster.create({
        title: TASK.TASK_CREATED_TOAST_TITLE,
        description: TASK.TASK_CREATED_TOAST_DESC,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await dispatch(
        updateTaskThunk({
          taskData: {
            id: selectedTask.id,
            title: editForm.title,
            description: editForm.description,
            status: editForm.status,
          },
          token,
        })
      ).unwrap();
      toaster.create({
        title: TASK.TASK_UPDATED_TOAST_TITLE,
        description: TASK.TASK_UPDATED_TOAST_DESC,
      });
      setSelectedTask(null);
      dispatch(fetchUserTasks(token));
    } catch (err) {
      console.error(err);
      toaster.create({
        title: TASK.TASK_UPDATE_FAILED_TITLE,
        description: err.message,
        status: "error",
      });
    }
  };
  const getUserNameById = (id) => {
    const found = allUsers.find((u) => u.id === id);
    return found
      ? `${found.firstName} ${found.lastName} (${found.email})`
      : "Unknown";
  };

  const getTasksByStatus = (tasks, status) =>
    tasks.filter((task) => task.status === status);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  const activeTasks = taskView[0] === "created" ? createdTasks : assignedTasks;

  return (
    <Box p={8} bg="gray.100" minH="100vh">
      <Stack spacing={10}>
        <Box>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button mb={4} colorScheme="teal" size="md">
                + Create Task
              </Button>
            </Dialog.Trigger>
            <Dialog.Backdrop bg="blackAlpha.500" />
            <Dialog.Positioner>
              <Dialog.Content
                borderRadius="2xl"
                boxShadow="2xl"
                bg="white"
                px={8}
                py={6}
                minW="sm"
                border="1px solid"
                borderColor="gray.200"
              >
                <Dialog.CloseTrigger />
                <Dialog.Header borderBottom="1px solid" borderColor="gray.200">
                  <Dialog.Title
                    fontSize="2xl"
                    fontWeight="bold"
                    color="teal.700"
                  >
                    Create a Task
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <form onSubmit={handleCreateTask}>
                    <Fieldset.Root size="lg" maxW="md">
                      <Stack spacing={5} mt={4}>
                        <Field.Root>
                          <Field.Label
                            fontWeight="semibold"
                            color="gray.600"
                            fontSize="sm"
                          >
                            Title
                          </Field.Label>
                          <Input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!formError.title}
                            focusBorderColor="teal.500"
                            bg="gray.50"
                            _focus={{
                              bg: "white",
                              borderColor: "teal.400",
                              boxShadow: "sm",
                            }}
                          />
                          {formError.title && (
                            <Text color="red.500" fontSize="sm">
                              {formError.title}
                            </Text>
                          )}
                        </Field.Root>

                        <Field.Root>
                          <Field.Label
                            fontWeight="semibold"
                            color="gray.600"
                            fontSize="sm"
                          >
                            Description
                          </Field.Label>
                          <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder={TASK.PLACEHOLDER_DESCRIPTION}
                            bg="gray.50"
                            _focus={{ bg: "white", borderColor: "teal.500" }}
                            resize="vertical"
                            minH="100px"
                          />
                        </Field.Root>

                        <Field.Root>
                          <Field.Label fontWeight="bold" color="gray.700">
                            Assign To
                          </Field.Label>
                          <Input
                            name="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onBlur={handleBlur}
                            placeholder={TASK.SEARCH_USER_PLACEHOLDER}
                            isInvalid={!!formError.assignedTo}
                            focusBorderColor="teal.500"
                            bg="gray.50"
                            _focus={{
                              bg: "white",
                              borderColor: "teal.400",
                              boxShadow: "sm",
                            }}
                          />
                          <Button
                            variant="outline"
                            colorScheme="teal"
                            size="xs"
                            onClick={() => {
                              if (user) {
                                setForm((prev) => ({
                                  ...prev,
                                  assignedToId: user.id,
                                }));
                                setQuery(`${user.firstName} ${user.lastName}`);
                                dispatch(clearSuggestions());
                                setFormError((prev) => ({
                                  ...prev,
                                  assignedTo: "",
                                }));
                              }
                            }}
                          >
                            Assign to Me
                          </Button>

                          {formError.assignedTo && (
                            <Text color="red.500" fontSize="sm">
                              {formError.assignedTo}
                            </Text>
                          )}

                          {suggestions.length > 0 && (
                            <Stack
                              mt={2}
                              spacing={1}
                              border="1px solid #ccc"
                              borderRadius="md"
                              p={2}
                              bg="gray.50"
                            >
                              {suggestions.map((user) => (
                                <Text
                                  key={user.id}
                                  _hover={{
                                    bg: "teal.50",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setForm((prev) => ({
                                      ...prev,
                                      assignedToId: user.id,
                                    }));
                                    setQuery(
                                      `${user.firstName} ${user.lastName}`
                                    );
                                    dispatch(clearSuggestions());
                                    setFormError((prev) => ({
                                      ...prev,
                                      assignedTo: "",
                                    }));
                                  }}
                                >
                                  {user.firstName} {user.lastName} ({user.email}
                                  )
                                </Text>
                              ))}
                            </Stack>
                          )}
                        </Field.Root>

                        <Button
                          type="submit"
                          colorScheme="teal"
                          isLoading={creating}
                          isDisabled={!form.title.trim() || !form.assignedToId}
                        >
                          Create Task
                        </Button>
                      </Stack>
                    </Fieldset.Root>
                  </form>
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </Box>
        <Box>
          <Select.Root
            value={taskView}
            onValueChange={({ value }) => setTaskView(value)}
            collection={taskViewOptions}
            size="md"
            width="250px"
          >
            <Select.HiddenSelect />
            <Select.Control borderColor="teal.500">
              <Select.Trigger>
                <Select.ValueText
                  placeholder={TASK.SELECT_TASK_VIEW_PLACEHOLDER}
                />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content bg="white" shadow="lg" borderRadius="md">
                  <For each={taskViewOptions.items}>
                    {(option) => (
                      <Select.Item key={option.value} item={option}>
                        {option.label}
                      </Select.Item>
                    )}
                  </For>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>
        <Box>
          <Heading size="md" mb={4} color="teal.700"></Heading>
          <Flex justify="space-between" gap={4}>
            {TASK.STATUS.map((status) => (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1 }}
              >
                <Box
                  p={4}
                  bg="white"
                  borderRadius="xl"
                  boxShadow="md"
                  borderTop="4px solid"
                  borderColor={
                    status === "TODO"
                      ? "orange.400"
                      : status === "IN_PROGRESS"
                      ? "blue.400"
                      : "green.400"
                  }
                >
                  <Heading
                    size="md"
                    mb={3}
                    color={
                      status === "TODO"
                        ? "orange.600"
                        : status === "IN_PROGRESS"
                        ? "blue.600"
                        : "green.600"
                    }
                    fontWeight="bold"
                  >
                    {status.replace("_", " ")}
                  </Heading>
                  <Stack spacing={3}>
                    {getTasksByStatus(activeTasks, status).length === 0 ? (
                      <Text color="gray.500">No tasks</Text>
                    ) : (
                      getTasksByStatus(activeTasks, status).map((task) => (
                        <motion.div
                          key={task.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Box
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            bg="white"
                            transition="0.2s"
                            _hover={{ boxShadow: "md" }}
                          >
                            <Text
                              fontWeight="bold"
                              color="teal.600"
                              _hover={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                setSelectedTask(task);
                                if (task.assignedToId === user?.id) {
                                  setIsEditing(true);
                                  setEditForm({
                                    title: task.title,
                                    description: task.description || "",
                                    status: task.status,
                                  });
                                } else {
                                  setIsEditing(false);
                                }
                              }}
                            >
                              {task.title}
                            </Text>
                            <Text fontSize="sm" color="gray.600" mt={1}>
                              {taskView[0] === "created"
                                ? `Assigned to: ${getUserNameById(
                                    task.assignedToId
                                  )}`
                                : `Assigned by: ${getUserNameById(
                                    task.assignedById
                                  )}`}
                            </Text>
                          </Box>
                        </motion.div>
                      ))
                    )}
                  </Stack>
                </Box>
              </motion.div>
            ))}
          </Flex>
        </Box>
        {/* View Task Dialog */}
        <Box p={8} bg="gray.100" minH="100vh">
          <Stack spacing={10}>
            {/* View Task Dialog */}
            {selectedTask && (
              <Box p={8} bg="gray.100" minH="100vh">
                <Stack spacing={10}>
                  {/* View Task Dialog */}
                  {selectedTask && (
                    <Dialog.Root
                      open
                      onOpenChange={() => setSelectedTask(null)}
                    >
                      <Dialog.Backdrop bg="blackAlpha.600" />
                      <Dialog.Positioner>
                        <Dialog.Content
                          borderRadius="2xl"
                          boxShadow="2xl"
                          bg="white"
                          px={8}
                          py={6}
                          minW="sm"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <Dialog.CloseTrigger />
                          <Dialog.Header
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            mb={4}
                          >
                            <Dialog.Title
                              fontSize="2xl"
                              fontWeight="bold"
                              color="teal.700"
                            >
                              {isEditing ? "Edit Task" : selectedTask.title}
                            </Dialog.Title>

                            {isEditing && (
                              <Box minW="180px">
                                <Select.Root
                                  value={[editForm.status]}
                                  onValueChange={({ value }) => {
                                    setEditForm((prev) => ({
                                      ...prev,
                                      status: value[0],
                                    }));
                                  }}
                                  collection={createListCollection({
                                    items: TASK.STATUS_OPTIONS,
                                  })}
                                >
                                  <Select.HiddenSelect />
                                  <Select.Control borderColor="teal.500">
                                    <Select.Trigger>
                                      <Select.ValueText
                                        placeholder={TASK.PLACEHOLDER_STATUS}
                                      />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                      <Select.Indicator />
                                    </Select.IndicatorGroup>
                                  </Select.Control>
                                  <Select.Positioner>
                                    <Select.Content bg="white">
                                      <For each={TASK.STATUS_OPTIONS}>
                                        {(item) => (
                                          <Select.Item
                                            key={item.value}
                                            item={item}
                                          >
                                            {item.label}
                                          </Select.Item>
                                        )}
                                      </For>
                                    </Select.Content>
                                  </Select.Positioner>
                                </Select.Root>
                              </Box>
                            )}
                          </Dialog.Header>

                          <Dialog.Body>
                            <Fieldset.Root size="lg" maxW="md">
                              <Stack spacing={5} pt={2}>
                                {isEditing ? (
                                  <>
                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Title
                                      </Field.Label>
                                      <Input
                                        bg="gray.50"
                                        focusBorderColor="teal.500"
                                        _focus={{
                                          bg: "white",
                                          borderColor: "teal.400",
                                          boxShadow: "sm",
                                        }}
                                        value={editForm.title}
                                        onChange={(e) =>
                                          setEditForm((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                          }))
                                        }
                                      />
                                    </Field.Root>

                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Description
                                      </Field.Label>
                                      <Textarea
                                        bg="gray.50"
                                        focusBorderColor="teal.500"
                                        _focus={{
                                          bg: "white",
                                          borderColor: "teal.400",
                                          boxShadow: "sm",
                                        }}
                                        value={editForm.description}
                                        onChange={(e) =>
                                          setEditForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                          }))
                                        }
                                        minH="100px"
                                        resize="vertical"
                                      />
                                    </Field.Root>

                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Assigned To
                                      </Field.Label>
                                      <Input
                                        value={getUserNameById(
                                          selectedTask.assignedToId
                                        )}
                                        isReadOnly
                                        bg="gray.50"
                                      />
                                    </Field.Root>

                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Assigned By
                                      </Field.Label>
                                      <Input
                                        value={getUserNameById(
                                          selectedTask.assignedById
                                        )}
                                        isReadOnly
                                        bg="gray.50"
                                      />
                                    </Field.Root>

                                    <Button
                                      colorScheme="teal"
                                      mt={2}
                                      onClick={handleEditSubmit}
                                    >
                                      Save Changes
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Title
                                      </Field.Label>
                                      <Text
                                        color="teal.700"
                                        fontWeight="semibold"
                                      >
                                        {selectedTask.title}
                                      </Text>
                                    </Field.Root>

                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Description
                                      </Field.Label>
                                      <Text>{selectedTask.description}</Text>
                                    </Field.Root>

                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Status
                                      </Field.Label>
                                      <Text
                                        px={2}
                                        py={1}
                                        bg={
                                          selectedTask.status === "DONE"
                                            ? "green.100"
                                            : selectedTask.status ===
                                              "IN_PROGRESS"
                                            ? "blue.100"
                                            : "orange.100"
                                        }
                                        color={
                                          selectedTask.status === "DONE"
                                            ? "green.700"
                                            : selectedTask.status ===
                                              "IN_PROGRESS"
                                            ? "blue.700"
                                            : "orange.700"
                                        }
                                        borderRadius="md"
                                        fontWeight="medium"
                                        display="inline-block"
                                        w="fit-content"
                                      >
                                        {selectedTask.status.replace("_", " ")}
                                      </Text>
                                    </Field.Root>

                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Assigned To
                                      </Field.Label>
                                      <Input
                                        value={getUserNameById(
                                          selectedTask.assignedToId
                                        )}
                                        isReadOnly
                                        bg="gray.50"
                                      />
                                    </Field.Root>

                                    <Field.Root>
                                      <Field.Label
                                        fontWeight="semibold"
                                        color="gray.600"
                                        fontSize="sm"
                                      >
                                        Assigned By
                                      </Field.Label>
                                      <Input
                                        value={getUserNameById(
                                          selectedTask.assignedById
                                        )}
                                        isReadOnly
                                        bg="gray.50"
                                      />
                                    </Field.Root>
                                  </>
                                )}
                              </Stack>
                            </Fieldset.Root>
                          </Dialog.Body>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Dialog.Root>
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;
