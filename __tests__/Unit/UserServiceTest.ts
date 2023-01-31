import { UserService } from "../../app/services/UserService";
const userService = new UserService();

describe("Create Test", function () {
  const rows = [
    {
      params: {
        name: "nam test 1",
        password: '123456',
        email: "expressTest1@gmail.com",
        group_ids: []
      },
    },
    {
      params: {
        name: "nam test 2",
        password: '123456234',
        email: "expressTest2@gmail.com",
        group_ids: []
      },
    },
    {
      params: {
        name: "nam test 3",
        password: '12345678',
        email: "expressTest4@gmail.com",
        group_ids: []
      },
    },
  ];

  test.each(rows)("will compare result", async ({ params }) => {
    const result = await userService.storeUser(params);
    expect(result).toBe(true);
  });
});

afterEach(() => {
    console.log("sau khi test");
});
