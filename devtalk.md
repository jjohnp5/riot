# Riot API

## MVC

 - Model : This layer deals with the data, it is responsible for making API calls to the backend and storing them in an object
 - View: This is the presentation layer, handled by EJS.
 - Controller: This is the layer which will act as a communication medium between the view and the Model.
 
 
The view has collects user interactions, packages them into an object and passes it on to the Controller. The Controller passes these requests from the View to the Model.

## View
View means everything inside HTML, the buttons, input boxes, the images etc.
View has all the listeners

##Controller
Controller is typically a javascript that has callbacks for all the listeners, its job is to only to listen from View and then pass on the request to the Model

## Model
Only the Model is supposed to interact with the backend
Model will have all the metadata. Kind of like an interface to the data. Model will tell us how many properties are there for a Summoner object or Item object. Model will also have methods to fetch some of these data from the backend


#Models for the RIOT API

## Champions

### Champion Object

 - Properties(ReadOnly)
   - Champion ID
   - Champion Name
   - Champion Title
   - Champion Blurb
   - Champion Image
   - Spells(array of spell IDs)

## Spells

### Spell Object

 - Properties(ReadOnly)
   - Spell Name
   - Spell ID
   - Spell Image
   - Spell Description
