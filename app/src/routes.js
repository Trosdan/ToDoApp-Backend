import { Router } from 'express';

import ToDoController from './app/controllers/ToDoController';

import auth from './app/middlewares/auth';

const routes = new Router();

routes.use(auth);

routes.get('/', (req, res) => {
  return res.send(req.user);
});

routes.get('/todo', ToDoController.index);
routes.get('/todo/:id', ToDoController.show);
routes.post('/todo', ToDoController.store);
routes.put('/todo/:id', ToDoController.update);
routes.delete('/todo/:id', ToDoController.delete);

export default routes;
