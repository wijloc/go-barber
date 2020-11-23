import { Router } from 'express';
import User from '../models/User';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({ name, email, password });

    type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
    type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

    type UserWithoutPassword = PartialBy<User, 'password'>;

    const userWithoutPassword: UserWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return response.send(userWithoutPassword);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
