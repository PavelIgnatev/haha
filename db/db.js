const { MongoClient } = require("mongodb");

const dbName = "link";
const collectionName = "linkedin";
const uri =
  "mongodb+srv://qwerty:qwerty123@linkedin.8lsnosx.mongodb.net/?retryWrites=true&w=majority";

let client; // хранение объекта клиента для базы данных
let db; // хранение объекта базы данных
let collection; // хранение объекта коллекции базы данных

const connect = async () => {
  client = await MongoClient.connect(uri, { useNewUrlParser: true });
  db = client.db(dbName);
  collection = db.collection(collectionName);
};

const getUserWithOutValue = async (skip) => {
  if (!collection) {
    await connect();
  }

  const query = { value: null };
  const result = await collection.find(query).skip(skip).limit(200).toArray();

  return result;
};

const getUserWithValue = async () => {
  if (!collection) {
    await connect();
  }

  const query = { value: { $ne: null } };
  const result = await collection.find(query).toArray();

  return result;
};


const getUserByUserName = async (username) => {
  if (!collection) {
    await connect();
  }

  const result = await collection.findOne({ username });

  return result;
};

const createUser = async (userData) => {
  if (!collection) {
    await connect();
  }

  const { username } = userData;

  if (!username) {
    throw new Error("Поле username не найдено");
  }

  const isUserCreated = await getUserByUserName(username);

  if (isUserCreated) {
    throw new Error("Пользователь с данным username уже существует");
  }

  await collection.insertOne(userData);
};

const deleteUser = async (username) => {
  if (!collection) {
    await connect();
  }

  if (!username) {
    throw new Error("Поле username не найдено");
  }

  await collection.deleteOne({ username });
};

const createUsers = async (usernames) => {
  if (!collection) {
    await connect();
  }

  if (!usernames.length) {
    return;
  }

  for (const username of usernames) {
    try {
      await createUser({ username, value: null });
    } catch (error) {}
  }
};

const updateUser = async (userData) => {
  if (!collection) {
    await connect();
  }

  const { username, value } = userData;

  if (!username) {
    throw new Error("Поле username не найдено");
  }

  const isUserCreated = await getUserByUserName(username);

  if (!isUserCreated) {
    throw new Error("Пользователь с данным username не существует");
  }

  const update = { $set: { value } };

  await collection.updateOne({ username }, update);
};

module.exports = {
  getUserWithOutValue,
  getUserWithValue,
  getUserByUserName,
  deleteUser,
  createUser,
  createUsers,
  updateUser,
};
