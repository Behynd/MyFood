import { StyleSheet } from "react-native";


export  const GlobalStyle = StyleSheet.create({
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
    },
    Test: {
        zIndex: 100,
        position: 'relative',
        top: 100
    },
    Caption: {
        fontSize: 30,
        fontWeight: '500',
        textAlign: 'center',
        
    },
    SettingsContainer: {
        display: 'flex',
        flexDirection: 'column',

    },
    SettingsItem: {
        flex: 1,
        padding: 20
    },
    Picker: {
        width: '100%',
        borderWidth: 3,
        borderRadius: 10,
    },
    PickerItem: {
        borderWidth: 2,
    },
    ListItem: {
        display: 'flex',
        flexDirection: 'row',
        width: "100%",
        
    },
    ListItemPart: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 20,
        textAlignVertical: 'center'
    },
    ListButton: {
        padding: 3
    },
    SearchBox: {
        margin: 10,
        padding: 10,
        borderWidth: 4,
        fontSize: 20,
        borderRadius: 10,
        flex: 1
    },
    Popup: {
        borderRadius: 10,
        elevation: 20,
        margin: 20,
        padding: 20,
        position: "relative",
        top: "30%"
        
    },
    FlexRow: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    ModalButtons: {
        fontSize: 40,

    },
    PropBox: {
        paddingLeft: 15,
        fontSize: 20,
        marginBottom: 10,
        borderWidth: 3,
    },
    PopText: {
        fontSize: 20,
        textAlign: 'center',
        padding: 20
    },
    IngItem: {
      
      display: 'flex',
      flexDirection: 'row',
      width: "100%",
      justifyContent: 'space-between'
    },
    IngPicker: {
      flex: 6,
      borderWidth: 3,
      borderRadius: 10,
    },
    IngAmountInput: {
      flex: 1,
      borderWidth: 3,
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 20,
      height: "93%",
      marginLeft: 10
    },
    UnitLabel: {
      marginLeft: 10,
      fontSize: 20,
      textAlignVertical: 'center'
    },
    IngDeleteButton: {
      padding: 5
    },
    IngListItem: {
        display: 'flex',
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center'
    },
    StepTextInput: {
      flex: 1,
      fontSize: 20,
      borderWidth: 3,
      borderRadius: 10,
    },
    StepAmountInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 20,
      borderWidth: 3,
      borderRadius: 10,
    },
    StepDelete: {
      padding: 5,
      
    },
    RecipeInfo: {
      display: 'flex',
      flexDirection: 'column',
      
      
      height: '100%'
    },
    RecipeInfoNameInput: {
      borderWidth: 3,
      borderRadius: 10,
      paddingLeft: 15,
      fontSize: 20,
      margin: 10
    },
    RecipeInfoTimeInput: {
      marginTop: 10,
      borderWidth: 3,
      borderRadius: 10,
      paddingLeft: 15,
      fontSize: 20,
      margin: 10
    },
    BtnSave: {
      justifyContent: 'space-between',
      display: 'flex',
      marginTop: 'auto',
      marginBottom: 120,
    },
    RecipeListComp: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%'
    },
    RecipeListPart: {
      width: "33%",
      textAlign: 'center'
    }


    
   
  });
