import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Center,
  Text,
  Link,
  Flex,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login } from "../features/auth/authSlice";
import { setActiveTab } from "../features/ui/uiSlice";
import { validateEmail } from "../utils/validation";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(form.email);
    if (!isEmailValid) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    dispatch(login(form));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Center>
        <Fieldset.Root size="lg" maxW="md" mx="auto" mt={10}>
          <Stack spacing={4}>
            <Fieldset.Legend>Login</Fieldset.Legend>
            <Fieldset.HelperText>
              Enter your credentials to log in.
            </Fieldset.HelperText>

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
              />
            </Field.Root>

            <Flex justify="flex-end">
              <Link color="blue.500" fontSize="sm" href="#">
                Forgot Password?
              </Link>
            </Flex>

            <Button type="submit" isLoading={loading}>
              Login
            </Button>

            <Text textAlign="center" fontSize="sm">
              Don’t have an account?{" "}
              <Link
                color="blue.500"
                href="#"
                fontWeight="medium"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setActiveTab("register"));
                }}
              >
                Register
              </Link>
            </Text>
          </Stack>
        </Fieldset.Root>
      </Center>
    </form>
  );
};

export default LoginPage;
