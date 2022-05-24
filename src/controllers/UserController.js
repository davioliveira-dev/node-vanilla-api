const users = require("../mocks/users");

module.exports = {
  listUsers: (req, res) => {
    const { order } = req.query;

    const sortedUsers = users.sort((a, b) => {
      if (order === "desc") {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });

    return res.send(200, sortedUsers);
  },
  getUser: (req, res) => {
    if (!req.params.id) {
      return res.send(400, { message: "Missing id" });
    }

    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
      return res.send(200, user);
    }

    return res.send(404, { message: "User not found" });
  },
  updateUser: (req, res) => {
    if (!req.params.id) {
      return res.send(400, { message: "Missing id" });
    }

    if (!req.body.name) {
      return res.send(400, { message: "Missing name on body" });
    }

    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
      user.name = req.body.name;
      users[user.id - 1] = user;
      return res.send(200, user);
    }

    return res.send(404, { message: "User not found" });
  },
  deleteUser: (req, res) => {
    if (!req.params.id) {
      return res.send(400, { message: "Missing id" });
    }

    const user = users.find((user) => user.id === Number(req.params.id));

    if (user) {
      users.splice(users.indexOf(user), 1);
      return res.send(200, { message: "User deleted" });
    }

    return res.send(404, { message: "User not found" });
  },
  createUser: (req, res) => {
    if (!req.body?.name) {
      return res.send(400, { message: "Missing name on body" });
    }

    const user = {
      id: users.length + 1,
      name: req.body.name,
    };

    users.push(user);

    return res.send(201, user);
  },
};
