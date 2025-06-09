import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Text,
  Link,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { register } from "../features/authSlice";
import { setActiveTab } from "../features/uiSlice";
import { validateEmail, getPasswordErrorMessages } from "../utils/validation";
import { toaster } from "../components/ui/toaster";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" && !value.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
    } else if (name === "lastName" && !value.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
    } else if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else if (name === "password") {
      const passwordIssues = getPasswordErrorMessages(value);
      setErrors((prev) => ({
        ...prev,
        password: passwordIssues.length ? passwordIssues.join(", ") : "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(form.email);
    const passwordErrors = getPasswordErrorMessages(form.password);

    const firstNameError = !form.firstName.trim()
      ? "First name is required"
      : "";
    const lastNameError = !form.lastName.trim() ? "Last name is required" : "";

    if (
      !isEmailValid ||
      passwordErrors.length > 0 ||
      firstNameError ||
      lastNameError
    ) {
      setErrors({
        firstName: firstNameError,
        lastName: lastNameError,
        email: isEmailValid ? "" : "Invalid email format",
        password: passwordErrors.join(", "),
      });
      return;
    }

    const result = await dispatch(register(form));

    if (register.fulfilled.match(result)) {
      toaster.create({
        title: "Registration successful",
        description: "You can now log in.",
      });
      dispatch(setActiveTab("login"));
    } else {
      toaster.create({
        title: "Registration failed",
        description: result.payload || "Please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      {loading ? (
        <Center>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
        </Center>
      ) : (
        <form onSubmit={handleSubmit}>
          <Fieldset.Root size="lg" maxW="md">
            <Stack spacing={4}>
              <Fieldset.Legend>Register</Fieldset.Legend>
              <Fieldset.HelperText>Create a new account.</Fieldset.HelperText>

              <Field.Root>
                <Field.Label>First Name</Field.Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <Text color="red.500" fontSize="sm">
                    {errors.firstName}
                  </Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>Last Name</Field.Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <Text color="red.500" fontSize="sm">
                    {errors.lastName}
                  </Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.email}
                />
                {errors.email && (
                  <Text color="red.500" fontSize="sm">
                    {errors.email}
                  </Text>
                )}
              </Field.Root>

              <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.password}
                />
                {errors.password && (
                  <Text color="red.500" fontSize="sm">
                    {errors.password}
                  </Text>
                )}
              </Field.Root>

              <Button type="submit">Register</Button>

              <Text textAlign="center" fontSize="sm">
                Already have an account?{" "}
                <Link
                  color="blue.500"
                  href="#"
                  fontWeight="medium"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setActiveTab("login"));
                  }}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Fieldset.Root>
        </form>
      )}
    </>
  );
};

export default RegisterPage;
