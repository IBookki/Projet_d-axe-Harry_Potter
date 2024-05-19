const prisma = require("../config/prisma");
const { hashPassword } = require("../utils/bcrypt");

class UsersController {
  async getMyProfile(req, res) {
    const user = req.user;
    return res.status(200).send(user);
  }

  // app.get (/users)
  async index(req, res) {
    const users = await prisma.user.findMany();
    return res.status(200).send(users);
  }

  // app.post (/users)
  async store(req, res) {
    try {
      const body = req.body;
      const user = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: await hashPassword(body.password),
        },
      });
      return res.status(201).send(user);
    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  }

  // app.get (/users/:id)
  async show(req, res) {
    const id = req.params.id; // 4
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (user === null) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send(user);
  }

  // app.put (/users/:id)
  async update(req, res) {
    try {
      const id = req.params.id;
      const body = req.body;

      let user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      user = await prisma.user.update({
        where: {
          id: parseInt(id),
        },
        data: {
          lasthousevisited: body.house,
        },
      });

      return res.status(200).send(user);
    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  }

  // UsersController.js

  async showProfile(req, res) {
    try {
      const user = req.user;
      const userId = user.id;
  
      // Récupérer les informations de l'utilisateur
      const userProfile = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          cards: true, // Inclure les cartes de l'utilisateur
          favoriteCards: true, // Inclure les cartes favorites de l'utilisateur
        },
      });
  
      // Ajouter l'adresse e-mail de l'utilisateur à l'objet userProfile
      userProfile.email = user.email;
  
      res.render("profile", { userProfile }); // Renvoyer les données à la vue
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).send("Internal Server Error");
    }
  }
  
  // app.delete (/users/:id)
  async destroy(req, res) {
    try {
      const id = req.params.id;

      let user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (user === null) {
        return res.status(404).send("User not found");
      }

      await prisma.user.delete({
        where: {
          id: parseInt(id),
        },
      });

      return res.status(204).send();
      // return res.status(200).send(users);
    } catch (e) {
      return res.status(500).send({
        message: e.message,
      });
    }
  }

  async gethouse(req, res) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return res.status(201).send({
      message: user.lasthousevisited,
    });
  }
}



module.exports = new UsersController();

// UsersController.js


