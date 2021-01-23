import { Router } from 'express';

import ToDoController from './app/controllers/ToDoController';

import auth from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.status(200).send("Todo App backend is running");
});

routes.use(auth);

routes.get('/todo', ToDoController.index);
routes.get('/todo/:id', ToDoController.show);
routes.post('/todo', ToDoController.store);
routes.put('/todo/:id', ToDoController.update);
routes.delete('/todo/:id', ToDoController.delete);

export default routes;
