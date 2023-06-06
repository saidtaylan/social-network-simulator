const authentication = require('../middlewares/authentication');
const validation = require('../middlewares/validation');
const Controller = require('../controller');
const service = require('../service');

const mockUser = {
  email: 'test@test.com',
  username: 'test',
  password: '123',
  id: '123',
};

jest.mock('../service', () => ({
  selectUser: jest.fn(),
  insertUser: jest.fn((body) => {}),
}));
jest.mock('../middlewares/authentication.js');
jest.mock('../middlewares/validation.js');

const req = {
  body: {
    email: 'test@test.com',
    username: 'test',
    password: '123',
  },
  user: {
    id: 1,
    email: 'test@test.com',
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};

const next = jest.fn(() => {});

describe('controller', () => {
  service.selectUser.mockReturnValue(mockUser);
  service.insertUser.mockReturnValue(mockUser);
  const controller = new Controller(service, authentication, validation);
  describe('create user', () => {
    it('should return 201', async () => {
      const dataToInsert = {
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
        following: [],
        follower: [],
      };
      await controller.createUser(req, res, next);
      expect(service.selectUser).toHaveBeenCalledWith({
        email: mockUser.email,
      });
      expect(service.insertUser).toHaveBeenCalledWith(dataToInsert);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: 'user created',
        data: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
        },
      });
    });
  });
});
