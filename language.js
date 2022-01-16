import { Tables, DB, CreateTable, Insert, Select, Delete, Update} from './Database/db';


export var Languages = ['Deutsch', 'English'];
function GetLabelsByLanguage(Setting) {
    switch (Setting.Language) {
        case 'Deutsch': 
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
                RecipeMaskWorkstepStepTime: 'Zeit (in min)',
                TutorialLanguagePart: '',
                TutorialMenuPart: 'Wilkommen zu {AppName}. In diesem Einstieg werden dir die wichtigsten Funktionen der App erklährt. Beginnen wir mit dem Zutaten Bereich',
                TutorialIngredientPart: 'In diesem Bereich kannst du deine Zutaten welche du für alle Rezepte verwendest, verwalten. Beginne damit, eine Zutat anzulegen.',
                TutorialIngredientAddPart: 'Hier gibt du den Name und die Einheit deiner Zutat an. Über den Haken mit dem Kreis bestätigst du deine Eingabe und schließt das Eingabefeld. Über den normalen Haken bestätigst du deine Eingabe, dass Popup beleibt jedoch für weitere Eingaben geöffnet. Über den Pfeil brichst du die Eingabe ab. Gib eine Zutat ein und bestätige mit dem Haken',
                TutorialIngredientDeleteUpdatePart: 'Die Zutat ist nun in der Liste erschienen. Über die 2 rechten Knöpfe einer jeden Zutat lässt sich diese Löschen oder aktualisieren. Über die Suchfunktion kannst du nach einer gewissen Zutat per Name oder Einheit suchen. Kehre nun zum Hauptmenü zurück.',
                TutorialRecipePart: 'In diesem Bereich kannst du deine Rezepte verwalten. Lege ein Rezept an.',
                TutorialRecipeInfoPart: 'Hier stehen 3 Tabs zur auswahl. Info, Zutatsliste und Arbeitsschrittliste. Im Infotab gibst du den Name und die Dauer des Rezeptes an. Außerdem findet sich hier der Speichernknopf. Gehe nun in den nächsten Bereich',
                TutorialRecipeIngredientPart: 'In dem Bereich gibst du alle Zutaten für dieses Rezept an. Ein Auswahlfeld für die zuvor angelegten Zutaten und ein Feld für die Menge sind gegeben. Über den Plus Knopf unten lassen sich weitere Einträge hinzufügen. '
            }
            
        case 'English': 
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
}

export default GetLabelsByLanguage;
