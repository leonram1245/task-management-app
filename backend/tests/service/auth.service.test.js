import { jest } from "@jest/globals";

// Mock Prisma and dependencies before importing the service
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockHash = jest.fn();
const mockCompare = jest.fn();
const mockSign = jest.fn();

jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
    },
  })),
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: mockHash,
    compare: mockCompare,
  },
  hash: mockHash,
  compare: mockCompare,
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: mockSign,
  },
  sign: mockSign,
}));

const { signupService, loginService } = await import(
  "../../service/auth.service.js"
);

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret";
  });

  describe("signupService", () => {
    it("should create a new user and return user info", async () => {
      mockFindUnique.mockResolvedValue(null);
      mockHash.mockResolvedValue("hashedpw");
      const createdUser = {
        id: 1,
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        password: "hashedpw",
      };
      mockCreate.mockResolvedValue(createdUser);

      const result = await signupService({
        email: "test@example.com",
        password: "pw",
        firstName: "Test",
        lastName: "User",
      });

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockHash).toHaveBeenCalledWith("pw", 10);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          password: "hashedpw",
        },
      });
      expect(result).toEqual({
        user: {
          id: 1,
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      });
    });

    it("should throw if email already exists", async () => {
      mockFindUnique.mockResolvedValue({ id: 1 });

      await expect(
        signupService({
          email: "test@example.com",
          password: "pw",
          firstName: "Test",
          lastName: "User",
        })
      ).rejects.toThrow("Email already exists");
    });
  });

  describe("loginService", () => {
    it("should login and return token and user info", async () => {
      const user = {
        id: 1,
        email: "test@example.com",
        password: "hashedpw",
        firstName: "Test",
        lastName: "User",
      };
      mockFindUnique.mockResolvedValue(user);
      mockCompare.mockResolvedValue(true);
      mockSign.mockReturnValue("jwt-token");

      const result = await loginService({
        email: "test@example.com",
        password: "pw",
      });

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockCompare).toHaveBeenCalledWith("pw", "hashedpw");
      expect(mockSign).toHaveBeenCalledWith({ id: 1 }, "testsecret");
      expect(result).toEqual({
        token: "jwt-token",
        user: {
          id: 1,
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
        },
      });
    });

    it("should throw if user not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(
        loginService({
          email: "test@example.com",
          password: "pw",
        })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw if password does not match", async () => {
      mockFindUnique.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedpw",
        firstName: "Test",
        lastName: "User",
      });
      mockCompare.mockResolvedValue(false);

      await expect(
        loginService({
          email: "test@example.com",
          password: "wrongpw",
        })
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
