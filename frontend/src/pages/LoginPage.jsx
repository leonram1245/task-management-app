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
import { useNavigate } from "react-router-dom";
import { login } from "../features/authSlice";
import { setActiveTab } from "../features/uiSlice";
import { validateEmail } from "../utils/validation";
import { toaster } from "../components/ui/toaster";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(form.email);
    if (!isEmailValid) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    const result = await dispatch(login(form));

    if (login.fulfilled.match(result)) {
      toaster.create({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/dashboard");
    } else {
      let errorMsg = "Login failed. Please try again.";
      if (result.payload) {
        errorMsg =
          typeof result.payload === "string"
            ? result.payload
            : JSON.stringify(result.payload);
      } else if (result.error && result.error.message) {
        errorMsg = result.error.message;
      }

      toaster.create({
        title: "Login failed",
        description: errorMsg,
        type: "error",
      });
    }
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

            <Flex justify="flex-end"></Flex>

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
