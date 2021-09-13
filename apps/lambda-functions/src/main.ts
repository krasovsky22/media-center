import Favorite from './favorite';
import * as AWS from 'aws-sdk';

import { v4 as uuidv4 } from 'uuid';

type AppSynEvent = {
  info: { s; fieldName: string };
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

const createFavorite = async (favorite: Favorite) => {
  if (!favorite.id) {
    favorite.id = uuidv4();
  }

  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Item: favorite,
  };

  await docClient.put(params).promise();
  return favorite;
};

const deleteFavorite = async (id: string) => {
  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Key: { id },
  };
  await docClient.delete(params).promise();
  return id;
};

exports.handler = async (event: AppSynEvent) => {
  try {
    switch (event.info.fieldName) {
      case 'listFavorites':
        return await listFavorites();
      case 'createFavorite':
        return await createFavorite(event.arguments.favorite);
      case 'deleteFavorite':
        return await deleteFavorite(event.arguments.id);
      default:
        return null;
    }
  } catch (e) {
    console.log('DynamoDB error: ', e);
    return null;
  }
};

console.log(uuidv4());
