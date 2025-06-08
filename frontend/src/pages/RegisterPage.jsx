import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Center,
  Text,
  Link,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { register } from "../features/auth/authSlice";
import { setActiveTab } from "../features/ui/uiSlice";
import { validateEmail, getPasswordErrorMessages } from "../utils/validation";

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
    if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    } else if (name === "password") {
      const passwordIssues = getPasswordErrorMessages(value);
      setErrors((prev) => ({
        ...prev,
        password: passwordIssues.length ? passwordIssues.join(", ") : "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(form.email);
    const passwordErrors = getPasswordErrorMessages(form.password);

    if (!isEmailValid || passwordErrors.length > 0) {
      setErrors({
        email: isEmailValid ? "" : "Invalid email format",
        password: passwordErrors.join(", "),
      });
      return;
    }

    dispatch(register(form));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Center>
        <Fieldset.Root size="lg" maxW="md" mx="auto" mt={10}>
          <Stack spacing={4}>
            <Fieldset.Legend>Register</Fieldset.Legend>
            <Fieldset.HelperText>Create a new account.</Fieldset.HelperText>

            <Field.Root>
              <Field.Label>First Name</Field.Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Last Name</Field.Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Email</Field.Label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
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
              />
              {errors.password && (
                <Text color="red.500" fontSize="sm">
                  {errors.password}
                </Text>
              )}
            </Field.Root>

            <Button type="submit" isLoading={loading}>
              Register
            </Button>

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
      </Center>
    </form>
  );
};

export default RegisterPage;
