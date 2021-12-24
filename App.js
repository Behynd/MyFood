/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useState,useLayoutEffect, useEffect} from 'react';
import { Tables, DB, CreateTable, Insert, Select, Delete, Update, DropTable} from './Database/db';
import { NavigationContainer } from '@react-navigation/native';
import {
  
  Image,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  LogBox,
  View,
  
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ColorPicker from 'react-native-wheel-color-picker';
import { GlobalStyle} from './style';
import Settings from './Components/Settings';
import Ingredient from './Components/Ingredient';
import Recipe from './Components/Recipe';
import { RecipeTabs } from './Components/RecipeMask';
import RecipeChange from './Components/RecipeChange';
import Lang from './language';
import Menu from './Components/Menu';

var styles = StyleSheet.create({
  flexContainer: {
    
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  header: {
    backgroundColor: '#FFFF'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  item: {
    height: 270,
    width: 200
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 3
  },
  ToolbarItem: {
    height: '100%',
    width: 65,
  },
  MainColorPicker: {
    marginLeft: 20,
    marginRight: 20
  },
  AccentColorPicker: {
    
    marginLeft: 20,
    marginRight: 20
  }
});
// const Menu  = ({ navigation }) => {
//   const db = new DB();
 
//   const [settings, setSettings] = useState({ MainColor: '#F332', AccentColor: '#2d22'})
  
  
//   useEffect(() => {
//     Select(db, Tables.Settings).then((values) => {
//       if (values.length != 0){
//         setSettings({
//           MainColor: values[0].MainColor,
//           AccentColor: values[0].AccentColor,
//           FontColor: values[0].FontColor,
//           Language: values[0].Language
//         });
//         var lang = Lang(settings);
//         if (lang){
//           console.log(settings);
//           navigation.setOptions({ headerTitle: lang.StackCaptionMenu });
//         }
//       }
//       else {
//         Insert(db, Tables.Settings, { MainColor: '#FFFFFF', AccentColor: '#FFFFFF', FontColor: '#000000', Language: 'Deutsch'})
//         setSettings({
//           MainColor: '#FFFFFF',
//           AccentColor: '#FFFFFF',
//           FontColor: '#000000',
//           Language: 'Deutsch'
//         })
//       }
      
//     })  
    
//   }, [navigation])
  
//   function SetBackground() {
    
//     Select(db, Tables.Settings).then((values) => {
//       setSettings({
//         MainColor: values[0].MainColor,
//         AccentColor: values[0].AccentColor,
//         FontColor: values[0].FontColor,
//         Language: values[0].Language
//       });
//     })  
//   } 
  
  
//   useEffect(() => {
//     navigation.setOptions({ headerRight: () => (
//       <TouchableOpacity onPress={() => { navigation.navigate('Settings', {settings: settings, update: {SetBackground}}) }} style={GlobalStyle.ToolbarItem} activeOpacity={0.5}>
//           <Image style={GlobalStyle.ToolbarItem}  resizeMode='stretch' source={require('./Resources/Settings.png')}></Image>
//       </TouchableOpacity>
      
//     )})
//     navigation.setOptions({ headerStyle: { backgroundColor: settings.AccentColor}})
//     navigation.setOptions({ headerTintColor: settings.FontColor })
//   })
    
    
    
  
  
  
  


//   return (
//       <View style={[GlobalStyle.flexContainer, {backgroundColor: settings.MainColor}]}>
            
//             <View style={GlobalStyle.flexRow}>
//               <TouchableOpacity style={GlobalStyle.item} activeOpacity={0.5} onPress={() => { navigation.navigate('Ingredient', {settings: settings}); }}>
//                 <Image style={GlobalStyle.image} resizeMode='stretch' source={require('./Resources/Ingredient.png')}></Image>
//               </TouchableOpacity>
//               <TouchableOpacity style={GlobalStyle.item} activeOpacity={0.5} onPress={() => { navigation.navigate('Recipe', {settings: settings}); }}>
//                 <Image style={GlobalStyle.image} resizeMode='stretch' source={require('./Resources/Recipe.png')}></Image>
//               </TouchableOpacity>
//             </View>
//             <View style={GlobalStyle.flexRow}>
//               <TouchableOpacity style={GlobalStyle.item} activeOpacity={0.5}>
              <Image style={GlobalStyle.image} resizeMode='stretch' source={require('./Resources/PurchaseList.png')}></Image>
//               </TouchableOpacity>
//               <TouchableOpacity style={GlobalStyle.item} activeOpacity={0.5}>
//                 <Image style={GlobalStyle.image} resizeMode='stretch' source={require('./Resources/Schedule.png')}></Image>
//               </TouchableOpacity>
//             </View>
//           </View>
//   );
// }

const App = () => {
  
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  

  var db = DB();
  
  console.log("Starting Application...");
  // DropTable(db, Tables.Recipe)
  // DropTable(db, Tables.RecipeIngredients)
  // DropTable(db, Tables.RecipeWorksteps)
  
  CreateTable(db, { 
    TableName: 'Settings', 
    columns: [
        { Name: 'ID', Type: 'INTEGER', PRIMKEY: true, AUTOINC: true }, 
        { Name: 'MainColor', Type: 'TEXT' }, 
        { Name: 'AccentColor', Type: 'TEXT' }, 
        { Name: 'FontColor', Type: 'TEXT'},
        { Name: 'Language', Type: 'TEXT' }
    ]
  });
  CreateTable(db, {
    TableName: 'Ingredient',
    columns: [
      { Name: 'ID', Type: 'INTEGER', PRIMKEY: true, AUTOINC: true},
      { Name: 'Name', Type: 'TEXT'},
      { Name: 'Unit', Type: 'TEXT'}
    ]
  });
  CreateTable(db, {
    TableName: 'Recipe',
    columns: [
      { Name: 'ID', Type: 'INTEGER', PRIMKEY: true, AUTOINC: true},
      { Name: 'Name', Type: 'TEXT'},
      { Name: 'PrepTime', Type: 'INTEGER'}
    ]
  });
  CreateTable(db, {
    TableName: 'RecipeIngredients',
    columns: [
      { Name: 'ID', Type: 'INTEGER', PRIMKEY: true, AUTOINC: true},
      { Name: 'RecipeID', Type: 'INTEGER'},
      { Name: 'IngredientID', Type: 'INTEGER'},
      { Name: 'Amount', Type: 'INTEGER'},
    ]
  });
  CreateTable(db, {
    TableName: 'RecipeWorksteps',
    columns: [
      { Name: 'ID', Type: 'INTEGER', PRIMKEY: true, AUTOINC: true},
      { Name: 'RecipeID', Type: 'INTEGER'},
      { Name: 'Text', Type: 'TEXT'},
      { Name: 'StepTime', Type: 'INTEGER'},
      { Name: 'OrderNumber', Type: 'INTEGER'},
    ]
  });
  
  const Stack = createStackNavigator();

  const [settings, setSettings] = useState({})
  
  
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen style={styles.Caption}
          name='Menu'
          component={Menu}
          options={({ navigation }) => ({
            headerTitle: 'Menü'
          })}       
        />
        <Stack.Screen 
          name="Settings"
          component={Settings}
          options={({route}) => ({
            
          })}
          
        />
        <Stack.Screen 
          name="Ingredient"
          component={Ingredient}
          options={({route}) => ({
            
          })}
          
        />
        <Stack.Screen 
          name="Recipe"
          component={Recipe}
          options={({route}) => ({
            
          })}
          
        />
        <Stack.Screen 
          name="RecipeMask"
          component={RecipeChange}
          
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
  


  
  
  

 
  //setMainColor(settings.MainColor)
  //setAccentColor(settings.AccentColor)
  //setLanguage(settings.Language)
  //Delete(db, Tables.Settings)
  //Insert(db, Tables.Settings, { MainColor: '#FFFFFF', AccentColor: '#FFFFFF', Language: 'Deutsch'});
  //const entity = Select(db, Tables.Settings)
 
  
};



export default App;
