import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from '../Database/db';

const Languages = {
    Deutsch: 'Deutsch',
    English: 'English'
}
const GetLabelsByLanguage = () => {
    var db = new DB();
    Select(db, Tables.Settings).then((Setting) => {
        switch (Setting.Language) {
            case Languages.Deutsch: 
                return {
                    StackCaptionMenu: 'Menü',
                    StackCaptionSettings: 'Einstellungen',
                    StackCaptionIngredients: 'Zutaten',
                    StackCaptionRecipe: 'Rezepte',
                    StackCaptionRecipeAdd: 'Rezept hinzufügen',
                    StackCaptionRecipeUpdate: 'Rezept aktualisieren',
                    StackCaptionPurchaseList: 'Einkaufsliste',
                    StackCaptionScheduler: 'Essensplaner',
                    SettingsLblMainColor: 'Hauptfarbe',
                    SettingsLblAccentColor: 'Akzentfarbe',
                    SettingsLblFontColor: 'Schriftfarbe',
                    SettingsLblLanguage: 'Sprache',
                    IngredientsSearchBar: 'Suche...',
                    IngredientsDeleteModal: 'Diese Zutat löschen?',
                    IngredientsAddUpdateName: 'Name (z.B.: Milch)',
                    IngredientsAddUpdateUnit: 'Einheit (z.B.: gramm)',
                    RecipeExpandStepNumber: 'Schrittnummer',
                    RecipeExpandStep: 'Schritt',
                    RecipeExpandStepTime: 'Zeit (in min)',
                    RecipeExpandIngredient: 'Zutat',
                    RecipeExpandIngredientAmount: 'Menge',
                    RecipeExpandIngredientUnit: 'Einheit',
                    RecipeMaskInfoName: 'Name des Rezeptes',
                    RecipeMaskInfoTime: 'Arbeitsdauer des Rezeptes',
                    RecipeMaskIngredientSelect: 'Zutat auswählen',
                    RecipeMaskIngredientAmount: 'min',
                    RecipeMaskWorkstepStep: 'Arbeitsschritt',
                    RecipeMaskWorkstepStepTime: 'Zeit (in min)'
                }
                
            case Languages.English: 
                return {
                    StackCaptionMenu: 'Menu',
                    StackCaptionSettings: 'Settings',
                    StackCaptionIngredients: 'Ingredient',
                    StackCaptionRecipe: 'Recipe',
                    StackCaptionRecipeAdd: 'Add Recipe',
                    StackCaptionRecipeUpdate: 'Update Recipe',
                    StackCaptionPurchaseList: 'Purchaselist',
                    StackCaptionScheduler: 'Planner',
                    SettingsLblMainColor: 'Maincolor',
                    SettingsLblAccentColor: 'Accentcolor',
                    SettingsLblFontColor: 'Fontcolor',
                    SettingsLblLanguage: 'Language',
                    IngredientsSearchBar: 'Search...',
                    IngredientsDeleteModal: 'Delete this Ingredient?',
                    IngredientsAddUpdateName: 'Name (e.g.: Milk)',
                    IngredientsAddUpdateUnit: 'Unit (e.g.: gramm)',
                    RecipeExpandStepNumber: 'Step number',
                    RecipeExpandStep: 'Step',
                    RecipeExpandStepTime: 'Time (in min)',
                    RecipeExpandIngredient: 'Ingredient',
                    RecipeExpandIngredientAmount: 'Amount',
                    RecipeExpandIngredientUnit: 'Unit',
                    RecipeMaskInfoName: 'Name of Recipe',
                    RecipeMaskInfoTime: 'Duration of Recipe',
                    RecipeMaskIngredientSelect: 'select Ingredient',
                    RecipeMaskIngredientAmount: 'min',
                    RecipeMaskWorkstepStep: 'Duration',
                    RecipeMaskWorkstepStepTime: 'Time (in min)'
                }
               
        }
    });
}

export default GetLabelsByLanguage;