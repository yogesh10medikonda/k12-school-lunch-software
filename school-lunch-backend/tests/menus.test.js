import 'dotenv/config';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../src/app.js';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

const baseMenu = {
  date: '2025-01-15',
  mealType: 'lunch',
  expectedServings: 100,
  status: 'Draft',
  items: [
    {
      foodItem: new mongoose.Types.ObjectId().toHexString(),
      servingSize: 150,
      ingredients: [
        {
          ingredient: new mongoose.Types.ObjectId().toHexString(),
          quantityPerServing: 50,
          unit: 'g',
        },
      ],
    },
  ],
};

describe('POST /api/menus', () => {
  it('creates a menu and returns 201 with the standard envelope', async () => {
    const res = await request(app).post('/api/menus').send(baseMenu);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.date).toBe('2025-01-15T00:00:00.000Z');
    expect(res.body.data.mealType).toBe('lunch');
    expect(res.body.data.expectedServings).toBe(100);
    expect(res.body.data._id).toBeDefined();
    expect(res.body.message).toBe('Menu created successfully');
  });

  it('returns 400 for missing required fields', async () => {
    const res = await request(app)
      .post('/api/menus')
      .send({ date: '2025-01-15' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('returns 400 for expectedServings less than 1', async () => {
    const res = await request(app)
      .post('/api/menus')
      .send({ ...baseMenu, expectedServings: 0 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 for duplicate date and mealType', async () => {
    await request(app).post('/api/menus').send(baseMenu);
    const res = await request(app).post('/api/menus').send(baseMenu);
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/menus', () => {
  beforeEach(async () => {
    await request(app).post('/api/menus').send(baseMenu);
    await request(app).post('/api/menus').send({
      ...baseMenu,
      date: '2025-01-16',
      mealType: 'breakfast',
      status: 'Published',
    });
  });

  it('returns a paginated list', async () => {
    const res = await request(app).get('/api/menus?page=1&limit=5');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.meta).toMatchObject({
      page: 1,
      limit: 5,
      total: 2,
      totalPages: 1,
    });
  });

  it('filters by mealType', async () => {
    const res = await request(app).get('/api/menus?mealType=lunch');
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].mealType).toBe('lunch');
  });

  it('filters by status', async () => {
    const res = await request(app).get('/api/menus?status=Published');
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe('Published');
  });

  it('filters by date range', async () => {
    const res = await request(app).get('/api/menus?dateFrom=2025-01-15&dateTo=2025-01-15');
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].date).toBe('2025-01-15T00:00:00.000Z');
  });

  it('sorts by date descending by default', async () => {
    const res = await request(app).get('/api/menus');
    expect(res.body.data[0].date).toBe('2025-01-16T00:00:00.000Z');
  });
});

describe('GET /api/menus/:id', () => {
  let menuId;

  beforeEach(async () => {
    const res = await request(app).post('/api/menus').send(baseMenu);
    menuId = res.body.data._id;
  });

  it('returns the full record', async () => {
    const res = await request(app).get(`/api/menus/${menuId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.mealType).toBe('lunch');
    expect(res.body.data.items).toBeDefined();
    expect(res.body.data.items.length).toBe(1);
  });

  it('returns 404 for a missing record', async () => {
    const res = await request(app).get(
      `/api/menus/${new mongoose.Types.ObjectId().toHexString()}`
    );
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for an invalid ObjectId', async () => {
    const res = await request(app).get('/api/menus/not-an-id');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('PUT /api/menus/:id', () => {
  let menuId;

  beforeEach(async () => {
    const res = await request(app).post('/api/menus').send(baseMenu);
    menuId = res.body.data._id;
  });

  it('updates a menu and returns 200', async () => {
    const res = await request(app)
      .put(`/api/menus/${menuId}`)
      .send({ expectedServings: 200, status: 'Published' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.expectedServings).toBe(200);
    expect(res.body.data.status).toBe('Published');
  });

  it('returns 409 when changing to an existing date/mealType', async () => {
    await request(app)
      .post('/api/menus')
      .send({ ...baseMenu, date: '2025-01-16', mealType: 'dinner' });
    const res = await request(app)
      .put(`/api/menus/${menuId}`)
      .send({ date: '2025-01-16', mealType: 'dinner' });
    expect(res.statusCode).toBe(409);
  });

  it('returns 400 for empty update body', async () => {
    const res = await request(app)
      .put(`/api/menus/${menuId}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('allows updating items array', async () => {
    const newFoodItemId = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
      .put(`/api/menus/${menuId}`)
      .send({
        items: [
          {
            foodItem: newFoodItemId,
            servingSize: 200,
            ingredients: [],
          },
        ],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].foodItem).toBe(newFoodItemId);
  });
});

describe('DELETE /api/menus/:id', () => {
  let menuId;

  beforeEach(async () => {
    const res = await request(app).post('/api/menus').send(baseMenu);
    menuId = res.body.data._id;
  });

  it('deletes a menu and returns 200', async () => {
    const res = await request(app).delete(`/api/menus/${menuId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const check = await request(app).get(`/api/menus/${menuId}`);
    expect(check.statusCode).toBe(404);
  });

  it('returns 404 when already deleted', async () => {
    await request(app).delete(`/api/menus/${menuId}`);
    const res = await request(app).delete(`/api/menus/${menuId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('POST /api/menus/:id/duplicate', () => {
  let menuId;

  beforeEach(async () => {
    const res = await request(app).post('/api/menus').send(baseMenu);
    menuId = res.body.data._id;
  });

  it('duplicates a menu to a new date and returns 201', async () => {
    const res = await request(app)
      .post(`/api/menus/${menuId}/duplicate`)
      .send({ date: '2025-01-20' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.date).toBe('2025-01-20T00:00:00.000Z');
    expect(res.body.data.mealType).toBe('lunch');
    expect(res.body.data.expectedServings).toBe(100);
    expect(res.body.data._id).not.toBe(menuId);
    expect(res.body.message).toBe('Menu duplicated successfully');
  });

  it('returns 400 for missing date', async () => {
    const res = await request(app)
      .post(`/api/menus/${menuId}/duplicate`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 409 if menu already exists for the new date', async () => {
    await request(app).post('/api/menus').send({
      ...baseMenu,
      date: '2025-01-20',
    });
    const res = await request(app)
      .post(`/api/menus/${menuId}/duplicate`)
      .send({ date: '2025-01-20' });
    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 for non-existent menu', async () => {
    const res = await request(app)
      .post(`/api/menus/${new mongoose.Types.ObjectId().toHexString()}/duplicate`)
      .send({ date: '2025-01-20' });
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 400 for invalid menu ID', async () => {
    const res = await request(app)
      .post('/api/menus/not-an-id/duplicate')
      .send({ date: '2025-01-20' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});