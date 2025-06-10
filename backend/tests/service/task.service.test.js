import { jest } from "@jest/globals";

const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockFindFirst = jest.fn();
const mockDelete = jest.fn();

jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    task: {
      create: mockCreate,
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      update: mockUpdate,
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
  })),
}));

const {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} = await import("../../service/task.service.js");

describe("task.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTaskService", () => {
    it("should create a task", async () => {
      const mockTask = { id: 1, title: "Test" };
      mockCreate.mockResolvedValue(mockTask);

      const result = await createTaskService({
        title: "Test",
        description: "desc",
        assignedBy: 1,
        assignedTo: 2,
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: "Test",
          description: "desc",
          status: "TODO",
          assignedBy: { connect: { id: 1 } },
          assignedTo: { connect: { id: 2 } },
        },
      });
      expect(result).toBe(mockTask);
    });

    it("should use provided status", async () => {
      const mockTask = { id: 2, title: "Test2" };
      mockCreate.mockResolvedValue(mockTask);

      await createTaskService({
        title: "Test2",
        description: "desc2",
        assignedBy: 1,
        assignedTo: 2,
        status: "IN_PROGRESS",
      });

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: "IN_PROGRESS" }),
        })
      );
    });
  });

  describe("getTasksService", () => {
    it("should return created and assigned tasks", async () => {
      const createdTasks = [{ id: 1 }];
      const assignedTasks = [{ id: 2 }];
      mockFindMany
        .mockResolvedValueOnce(createdTasks)
        .mockResolvedValueOnce(assignedTasks);

      const result = await getTasksService(1);

      expect(mockFindMany).toHaveBeenCalledWith({ where: { assignedById: 1 } });
      expect(mockFindMany).toHaveBeenCalledWith({ where: { assignedToId: 1 } });
      expect(result).toEqual({ createdTasks, assignedTasks });
    });
  });

  describe("updateTaskService", () => {
    it("should update a task if found and authorized", async () => {
      const mockTask = { id: 1, assignedById: 1 };
      const updatedTask = { id: 1, title: "Updated" };
      mockFindUnique.mockResolvedValue(mockTask);
      mockUpdate.mockResolvedValue(updatedTask);

      const result = await updateTaskService({
        id: 1,
        title: "Updated",
        description: "desc",
        status: "DONE",
        userId: 1,
      });

      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: "Updated", description: "desc", status: "DONE" },
      });
      expect(result).toBe(updatedTask);
    });
  });

  describe("deleteTaskService", () => {
    it("should delete a task if found and authorized", async () => {
      const mockTask = { id: 1 };
      const deletedTask = { id: 1, title: "Deleted" };
      mockFindFirst.mockResolvedValue(mockTask);
      mockDelete.mockResolvedValue(deletedTask);

      const result = await deleteTaskService({ id: 1, userId: 1 });

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 1, assignedById: 1 },
      });
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(deletedTask);
    });
  });
});
