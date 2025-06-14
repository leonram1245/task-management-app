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
  Menu,
  Avatar,
  AvatarGroup,
  IconButton,
} from "@chakra-ui/react";

import { useCallback } from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchUserTasks,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
} from "../features/taskSlice";
import {
  searchUsers,
  clearSuggestions,
  fetchAllUsers,
} from "../features/userSlice";
import { logout } from "../features/authSlice";
import { useDebounce } from "use-debounce";
import { toaster } from "../components/ui/toaster";
import { TASK } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { Trash2, Bell, X } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [editFormError, setEditFormError] = useState({ title: "" });
  const taskViewOptions = createListCollection({
    items: TASK.TASK_VIEW_OPTIONS,
  });
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState({ title: "", assignedTo: "" });
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskView, setTaskView] = useState(["created"]);

  const getUserNameById = useCallback(
    (id) => {
      const found = allUsers.find((u) => u.id === id);
      return found
        ? `${found.firstName} ${found.lastName} (${found.email})`
        : "Unknown";
    },
    [allUsers]
  );

  const getTasksByStatus = (tasks, status) =>
    tasks.filter((task) => task.status === status);

  useEffect(() => {
    if (token) {
      dispatch(fetchUserTasks(token));
      dispatch(fetchAllUsers());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchUsers(debouncedQuery));
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

  // Edit form handlers with validation
  const handleEditTitleChange = (e) => {
    const value = e.target.value;
    setEditForm((prev) => ({
      ...prev,
      title: value,
    }));
    setEditFormError({ title: "" });
  };

  const handleEditTitleBlur = (e) => {
    const value = e.target.value;
    if (!value.trim()) {
      setEditFormError({ title: TASK.TITLE_REQUIRED });
    }
  };

  const handleEditSubmit = async () => {
    // Validate title before submitting
    if (!editForm.title.trim()) {
      setEditFormError({ title: TASK.TITLE_REQUIRED });
      return;
    }
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

  const handleLogout = () => {
    dispatch(logout());
    toaster.create({
      title: "Logged out",
      description: "You have been logged out successfully.",
      status: "success",
    });
    navigate("/");
  };

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
    <Box p={{ base: 4, md: 8 }} bg="gray.100" minH="100vh">
      <Stack spacing={{ base: 6, md: 10 }}>
        <Flex justify="flex-end" align="center">
          <Box position="relative" cursor="pointer" mr={4}>
            <Bell size={20} />
          </Box>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                p={0}
                borderRadius="full"
                _hover={{ bg: "transparent" }}
              >
                <Flex align="center" gap={2}>
                  <Text fontWeight="medium" color="gray.700">
                    Hi, {user?.firstName} {user?.lastName}
                  </Text>
                  <AvatarGroup>
                    <Avatar.Root>
                      <Avatar.Fallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </Avatar.Fallback>
                      <Avatar.Image
                        src={user?.avatarUrl || ""}
                        alt={`${user?.firstName} ${user?.lastName}`}
                      />
                    </Avatar.Root>
                  </AvatarGroup>
                </Flex>
              </Button>
            </Menu.Trigger>
            <Menu.Positioner>
              <Menu.Content
                borderRadius="md"
                bg="white"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
                minW="150px"
                py={2}
              >
                <Menu.Item onClick={handleLogout}>
                  <Text color="red.600" fontWeight="medium" cursor="pointer">
                    Logout
                  </Text>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Flex>

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
                px={{ base: 4, md: 8 }}
                py={{ base: 4, md: 6 }}
                borderRadius="2xl"
                boxShadow="2xl"
                bg="white"
                minW="sm"
                border="1px solid"
                borderColor="gray.200"
                position="relative"
              >
                {/* Close Button */}
                <Dialog.CloseTrigger asChild>
                  <X
                    size={25}
                    color="#2C7A7B"
                    style={{ position: "absolute", top: 5, right: 5 }}
                    cursor={"pointer"}
                  />
                </Dialog.CloseTrigger>
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
                            placeholder={TASK.PLACEHOLDER_TITLE}
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
                          w="full"
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
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
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
                                  setEditFormError({ title: "" });
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

                            {task.assignedById === user?.id && (
                              <Flex justify="flex-end" mt={2}>
                                <Button
                                  size="xs"
                                  colorScheme="red"
                                  variant="ghost"
                                  mt={2}
                                  onClick={async () => {
                                    const confirmed = window.confirm(
                                      "Are you sure you want to delete this task?"
                                    );
                                    if (!confirmed) return;

                                    try {
                                      await dispatch(
                                        deleteTaskThunk({
                                          taskId: task.id,
                                          token,
                                        })
                                      ).unwrap();
                                      toaster.create({
                                        title: "Task Deleted",
                                        description:
                                          "The task was successfully removed.",
                                      });
                                    } catch (err) {
                                      toaster.create({
                                        title: "Failed to delete task",
                                        description: err.message,
                                        status: "error",
                                      });
                                    }
                                  }}
                                >
                                  <Trash2 size={16} color="red" />
                                </Button>
                              </Flex>
                            )}
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
        <Box p={8} bg="gray.100" minH="100vh">
          <Stack spacing={10}>
            {selectedTask && (
              <Box p={8} bg="gray.100" minH="100vh">
                <Stack spacing={10}>
                  {selectedTask && (
                    <Dialog.Root
                      open
                      onOpenChange={() => setSelectedTask(null)}
                    >
                      <Dialog.Backdrop bg="blackAlpha.600" />
                      <Dialog.Positioner>
                        <Dialog.Content
                          px={{ base: 4, md: 8 }}
                          py={{ base: 4, md: 6 }}
                          borderRadius="2xl"
                          boxShadow="2xl"
                          bg="white"
                          border="1px solid"
                          borderColor="gray.200"
                          position="relative"
                        >
                          {/* Close Button */}
                          <Dialog.CloseTrigger asChild>
                            <X
                              size={25}
                              color="#2C7A7B"
                              style={{ position: "absolute", top: 5, right: 5 }}
                              cursor={"pointer"}
                            />
                          </Dialog.CloseTrigger>
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
                                        onChange={handleEditTitleChange}
                                        onBlur={handleEditTitleBlur}
                                        placeholder={TASK.PLACEHOLDER_TITLE}
                                        isInvalid={!!editFormError.title}
                                      />
                                      {editFormError.title && (
                                        <Text color="red.500" fontSize="sm">
                                          {editFormError.title}
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
                                        placeholder={
                                          TASK.PLACEHOLDER_DESCRIPTION
                                        }
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
                                        placeholder={
                                          TASK.PLACEHOLDER_ASSIGNED_TO
                                        }
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
                                        placeholder={
                                          TASK.PLACEHOLDER_ASSIGNED_BY
                                        }
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
                                      <Input
                                        value={selectedTask.title}
                                        isReadOnly
                                        bg="gray.50"
                                        focusBorderColor="teal.500"
                                        placeholder={TASK.PLACEHOLDER_TITLE}
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
                                        value={selectedTask.description}
                                        isReadOnly
                                        bg="gray.50"
                                        minH="100px"
                                        resize="vertical"
                                        focusBorderColor="teal.500"
                                        placeholder={
                                          TASK.PLACEHOLDER_DESCRIPTION
                                        }
                                      />
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
                                        placeholder={
                                          TASK.PLACEHOLDER_ASSIGNED_TO
                                        }
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
                                        placeholder={
                                          TASK.PLACEHOLDER_ASSIGNED_BY
                                        }
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
