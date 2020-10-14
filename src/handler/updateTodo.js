/**
 * 
 * @author AJ Catambay | Bridging Code 2020
 * 
 */
'use strict'

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTodo = (event, context, callback) => {

    const datetime = new Date().toISOString();
    const data = JSON.parse(event.body);

    if( typeof data.task !== 'string' || typeof data.done !== 'boolean') {
        console.error('Value of task or done is invalid');
        const response = {
            statusCode: 400,
            body: JSON.stringify({ "message":"Value of task or done is invalid" })
        }

        return;
    }

    const params = {
        TableName: 'todos',
        Key: {
            id: event.pathParameters.id
        },
        ExpressionAttributeValues: {
            ':t': data.task,
            ':d': data.done,
            ':u': datetime
        },
        UpdateExpression: 'set task = :t, done = :d, updatedAt = :u'
    };

    dynamoDb.update(params, (error, data) => {
        if(error) {
            console.error(error);
            callback(new Error(error));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };

        callback(null, response);
    });
}