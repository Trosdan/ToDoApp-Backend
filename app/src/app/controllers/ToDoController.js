import * as admin from 'firebase-admin';
import * as Yup from 'yup';

class ToDoController {
  async index(req, res) {
    let todos = [];
    try {
      const snapshot = await admin
        .firestore()
        .collection('users')
        .doc(req.user.user_id)
        .collection('todo')
        .get();
      snapshot.forEach(todo => {
        todos.push({ id: todo.id, ...todo.data() });
      });
    } catch (err) {
      return res.status(400).json({ error: err });
    }

    return res.send(todos);
  }

  async show(req, res) {
    const { id } = req.params;
    let todo;
    try {
      todo = await admin
        .firestore()
        .collection('users')
        .doc(req.user.user_id)
        .collection('todo')
        .doc(id)
        .get();
      if (!todo.data()) {
        throw 'Todo not exist';
      }
    } catch (err) {
      return res.status(400).json({ error: err });
    }

    return res.json({ id: todo.id, ...todo.data() });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      content: Yup.string().required(),
      completed: Yup.bool().required()
      // alarmEnabled: Yup.bool().required(),
      // alarmDate: Yup.date()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid ToDo' });
    }
    let todo = req.body;
    todo.createdAt = new Date().toISOString();
    todo.updatedAt = new Date().toISOString();
    let retorno;
    try {
      retorno = await admin
        .firestore()
        .collection('users')
        .doc(req.user.user_id)
        .collection('todo')
        .add(req.body);

    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    return res.json({id: retorno.id, ...todo});
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      content: Yup.string().required(),
      completed: Yup.bool().required(),
      // alarmEnabled: Yup.bool().required(),
      // alarmDate: Yup.date()
    });

    const { id } = req.params;
    let todo;
    try {
      todo = await admin
        .firestore()
        .collection('users')
        .doc(req.user.user_id)
        .collection('todo')
        .doc(id)
        .get();
      if (!todo) {
        throw 'Todo not exist';
      }
    } catch (err) {
      return res.status(400).json({ error: err });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid ToDo' });
    }

    todo = { ...todo.data(),...req.body };

    todo.updatedAt = new Date().toISOString();

    try {
      await admin
        .firestore()
        .collection('users')
        .doc(req.user.user_id)
        .collection('todo')
        .doc(id)
        .update(todo);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }

    return res.json({ id, ...todo });
  }

  async delete(req, res) {
    const { id } = req.params;
    try {
      const todo = await admin
        .firestore()
        .collection('users')
        .doc(req.user.user_id)
        .collection('todo')
        .doc(id)
        .delete();
    } catch (err) {
      return res.status(400).json({ error: err });
    }

    return res.json({ ok: true });
  }
}

export default new ToDoController();
