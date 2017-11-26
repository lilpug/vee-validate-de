/*!
    Title: VeeValidateDE
    URL: https://github.com/lilpug/vee-validate-de
    Version: 1.0.0
    Author: David Whitehead
    Copyright (c) David Whitehead
    Copyright license: MIT
    Description: This plugin extends the vee validator to work with data properties instead of only being form based.	             
*/
var VeeValidateDE =
{
    install: function (Vue, options)
    {     
		//This adds the global mixin for the extension plugin
		Vue.mixin(
		{  
			data: function()
			{
			  return {
				validationContainer: 
				{
				  storage: []
				}
			  }
			},
			beforeCreate: function()
			{
				//Adds the new functions to $validatorDE within the mixin so it can be used as this.$validatorDE.AddValidation() etc
				this.$validatorDE = 
				{          
				AddValidation: function(watchProperty, errorName, validationTypes)
				{
				  //Adds the validation against that specific error name
				  this.$validator.attach(errorName, validationTypes);

				  //Adds the watcher to the supplied property
				  this.$watch(watchProperty, function(newValue, oldValue) 
				  {       
					this.$validator.validate(errorName, newValue);                      
				  });	

				  //Adds the attached validation to the storage location for the ValidateAll function
				  var storageObject = {      	
					property: watchProperty,
					errorName: errorName
				  };    
				  this.validationContainer.storage.push(storageObject);
				}.bind(this),

				GetValue: function(property)
				{
				  if(property != null)
				  {
					//Stores the base instance of the object that we will be pulling the value from
					var valueStorage = this;

					//Splits the property string into section via using the dots
					var objectSections = property.split('.');

					//Iterates over the object going further into the object based on the split up sections
					for (index in objectSections) 
					{ 
					  valueStorage = valueStorage[objectSections[index]];
					}

					return valueStorage;        
				  }

				  return null;
				}.bind(this),

				ValidateAll: function(watchProperty, errorName, validationTypes)
				{
				  //Stores the temporary build that is going to be passed to the vee validator
				  var validationObject = {}

				  //Builds the validation object
				  for(item in this.validationContainer.storage)
				  {
					//Adds the name and processed value to the validation object
					validationObject[this.validationContainer.storage[item].errorName] = this.$validatorDE.GetValue(this.validationContainer.storage[item].property);        
				  }

				  //Triggers validation for all objects that have been added into the storage so far and returns the promise
				  return this.$validator.validateAll(validationObject);
				}.bind(this)
            }
			}
      });
    }
};