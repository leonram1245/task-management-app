import { jest } from "@jest/globals";

const mockFindMany = jest.fn();

jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findMany: mockFindMany,
    },
  })),
}));

const { searchUsersService, getAllUsersService } = await import(
  "../../service/user.service.js"
);

describe("user.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchUsersService", () => {
    it("should search users by email", async () => {
      const mockUsers = [
        { id: 1, firstName: "A", lastName: "B", email: "a@b.com" },
      ];
      mockFindMany.mockResolvedValue(mockUsers);

      const result = await searchUsersService("a@b.com");

      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          email: {
            contains: "a@b.com",
            mode: "insensitive",
          },
        },
        take: 10,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
      expect(result).toBe(mockUsers);
    });
  });

  describe("getAllUsersService", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { id: 1, firstName: "A", lastName: "B", email: "a@b.com" },
        { id: 2, firstName: "C", lastName: "D", email: "c@d.com" },
      ];
      mockFindMany.mockResolvedValue(mockUsers);

      const result = await getAllUsersService();

      expect(mockFindMany).toHaveBeenCalledWith({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
      expect(result).toBe(mockUsers);
    });
  });
});
