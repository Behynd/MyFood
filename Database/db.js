import { cloneWithoutLoc, enumBooleanBody } from '@babel/types';
import SQLite from 'react-native-sqlite-storage';
import { create } from 'react-test-renderer';

export const Tables = {
    Settings: 'Settings',
    Ingredients: 'Ingredient',
    Recipe: 'Recipe',
    RecipeIngredients: 'RecipeIngredients',
    RecipeWorksteps: 'RecipeWorksteps',
    ScheduleRecipe: 'ScheduleRecipe'
}

export const DBOperator = {
    EqualTo: '=',
    BiggerThan: '>',
    LesserThan: '<',
}

export const DBConnector = {
    Or: 'or',
    And: 'and'
}


export const DB = () => {
    return SQLite.openDatabase(
        {
            name: 'FoodDB',
            location: 'default'
        },
        () => {},
        error => { console.log(error) }
    )
}

export const CreateTable =  (db, tableObject) => {
    db.transaction((tx) => {
        var queryString = "CREATE TABLE IF NOT EXISTS ";
        queryString += tableObject.TableName + '(';
        var columns = tableObject.columns;
        for (var i = 0; i < columns.length; i++) {
            queryString += `${columns[i].Name} ${columns[i].Type} `;
            if (columns[i].PRIMKEY) queryString += 'PRIMARY KEY ';
            if (columns[i].AUTOINC) queryString += 'AUTOINCREMENT';
            if ((columns.length - 1) != i) queryString += ','
        }
        queryString += ');'
        tx.executeSql(queryString);
    })
}

export  function Insert(db, Table, entity)  {
    return new Promise((resolve, reject) => {
        db.transaction( async(tx) => {
            switch (Table) {
                case 'Settings':
                    var queryString = `INSERT INTO ${Table} (MainColor, AccentColor, Language) values('${entity.MainColor}', '${entity.AccentColor}', '${entity.Language}')`;
                    tx.executeSql(queryString, null, (tx, result) => { resolve(result.insertId) });
                    break;
                case 'Ingredient':
                    var queryString = `INSERT INTO ${Table} (Name, Unit) values('${entity.Name}','${entity.Unit}')`;
                    tx.executeSql(queryString, null, (tx, result) => { resolve(result.insertId) });
                    break;
                case 'Recipe':
                    console.log(entity)
                    var queryString = `INSERT INTO ${Table} (Name, PrepTime) values('${entity.Name}',${entity.PrepTime})`;
                    tx.executeSql(queryString, null, (tx, result) => { resolve(result.insertId) });
                    break;
                case 'RecipeIngredients':
                    var queryString = `INSERT INTO ${Table} (RecipeID, IngredientID, Amount) values(${entity.RecipeID},${entity.IngredientID},'${entity.Amount}')`;
                    tx.executeSql(queryString, null, (tx, result) => { resolve(result.insertId) });
                    break;
                case 'RecipeWorksteps':
                    var queryString = `INSERT INTO ${Table} (RecipeID, Text, StepTime, OrderNumber) values(${entity.RecipeID},'${entity.Text}',${entity.StepTime},${entity.OrderNumber})`;
                    tx.executeSql(queryString, null, (tx, result) => { resolve(result.insertId) });
                    break;
            }
        })
    })
}

export function Select(db, Table, Condition, Join)  {
    
    var queryString = `SELECT * FROM ${Table} `;
    if (Join) queryString += Join;
    if (Condition) queryString += `WHERE ${Condition}`;
    return new Promise((resolve, reject) => {
         db.transaction((tx) => {
             tx.executeSql(
                queryString,
                [],
                async (tx, results) => {
                    var Items = [];
                    for (var i = 0; i < results.rows.length; i++) {
                        Items.push(results.rows.item(i));
                    }
                    resolve(Items)
                }
            )
        })
    })
    
    
    
}



export async function Delete(db, Table, Condition) {
    var queryString = `DELETE FROM ${Table} `;
    if (Condition) queryString += `WHERE ${Condition}`;
    db.transaction(async (tx) => {
        tx.executeSql(queryString);
    })
}

export async function Update(db, Table, Statement, Condition) {
    
    var queryString = `UPDATE ${Table} SET ${Statement} `;
    if (Condition)  queryString += `WHERE ${Condition}`;
    
    db.transaction((tx) => {
        tx.executeSql(queryString);
    })
   
    
}

export async function DropTable(db, Table) {
    db.transaction((tx) => {
        tx.executeSql(`DROP TABLE ${Table}`)
    })
}




