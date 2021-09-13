import Favorite from './favorite';
import * as AWS from 'aws-sdk';

import { v4 as uuidv4 } from 'uuid';

type AppSynEvent = {
  info: { fieldName: string };
  arguments: {
    id: string;
    favorite: Favorite;
  };
  identity: {
    username: string;
    claims: {
      [key: string]: string[];
    };
  };
};

const docClient = new AWS.DynamoDB.DocumentClient();

const listFavorites = async () => {
  const params = {
    TableName: process.env.FAVORITE_TABLE,
  };

  const data = await docClient.scan(params).promise();
  return data.Items;
};

const listFavoritesByUsername = async (username: string) => {
  const params = {
    TableName: process.env.FAVORITE_TABLE,
    IndexName: 'favoritesByUsername',
    KeyConditionExpression: '#fieldName = :username',
    ExpressionAttributeNames: { '#fieldName': 'username' },
    ExpressionAttributeValues: { ':username': username },
  };

  const data = await docClient.query(params).promise();
  return data.Items;
};

const createFavorite = async (favorite: Favorite) => {
  if (!favorite.id) {
    favorite.id = uuidv4();
  }

  const params = {
    TableName: process.env.FAVORITE_TABLE,
    Item: favorite,
  };

  await docClient.put(params).promise();
  return favorite;
};

const deleteFavorite = async (id: string) => {
  const params = {
    TableName: process.env.FAVORITE_TABLE,
    Key: { id },
  };
  await docClient.delete(params).promise();
  return id;
};

exports.handler = async (event: AppSynEvent) => {
  console.log('event', event);
  try {
    switch (event.info.fieldName) {
      case 'listFavorites':
        return await listFavorites();
      case 'listFavoritesByUsername':
        return await listFavoritesByUsername(event.identity.username || '');
      case 'createFavorite':
        return await createFavorite({
          ...event.arguments.favorite,
          username: event.identity.username,
        });
      case 'deleteFavorite':
        return await deleteFavorite(event.arguments.id);
      default:
        return null;
    }
  } catch (e) {
    console.error('DynamoDB error: ', e);
    return null;
  }
};
