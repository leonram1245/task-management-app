import { Tabs, Box, Flex, Heading, Image } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { setActiveTab } from "../features/ui/uiSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.ui.activeTab);

  return (
    <Flex minH="100vh" flexDirection={{ base: "column", md: "row" }}>
      {/* Left side with Tabs */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        bg="white"
        p={{ base: 6, md: 10 }}
        flexDirection="column"
      >
        <Heading fontSize="2xl" mb={6} textAlign="center" color="gray.700">
          Task Management App
        </Heading>

        <Tabs.Root value={activeTab} w="100%" maxW="400px">
          <Tabs.List mb={6} justifyContent="center">
            <Tabs.Trigger
              value="login"
              onClick={() => dispatch(setActiveTab("login"))}
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="register"
              onClick={() => dispatch(setActiveTab("register"))}
            >
              Register
            </Tabs.Trigger>
            <Tabs.Indicator />
          </Tabs.List>

          <Tabs.Content value="login">
            <LoginPage />
          </Tabs.Content>
          <Tabs.Content value="register">
            <RegisterPage />
          </Tabs.Content>
        </Tabs.Root>
      </Flex>

      {/* Right Column */}
      <Flex
        flex="1"
        bg="#111827"
        align="center"
        justify="center"
        display={{ base: "none", md: "flex" }}
        minW="400px"
        p={10}
      >
        <Box textAlign="center">
          <Image
            src="/images/graphics.png"
            alt="Storyboard"
            maxW="90%"
            maxH="600px"
            mx="auto"
            mb={6}
          />
          <Heading fontSize="lg" color="#facc15">
            Organize your team. Track tasks. Deliver better.
          </Heading>
        </Box>
      </Flex>
    </Flex>
  );
};

export default LandingPage;
