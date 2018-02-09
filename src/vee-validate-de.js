/*!
    Title: VeeValidateDE
    URL: https://github.com/lilpug/vee-validate-de
    Version: 1.3.0
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
					//This function hooks up a vee validator to a specific vuejs data property, it also adds a watching to monitor for any changes and triggers vee validator every time
					AddValidation: function(watchProperty, errorName, validationTypes)
					{
						//Checks if the parameters have been supplied otherwise outputs the error
						if(
							watchProperty != undefined && watchProperty != null && watchProperty != '' &&
							errorName != undefined && errorName != null && errorName != '' &&
							validationTypes != undefined && validationTypes != null && validationTypes != '' 
						  )
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
						  }
						  else
						  {
							  console.log("VeeValidateDE Error: some of the parameters for the AddValidation function are null or empty.");
						  }
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

					//This function merges a object of arrays into the vee validate errors
					//Note: good for server side errors being sent back etc
					AddAdditionalErrors: function(errors)
					{
						//Checks we have params before we continue
						if(errors != undefined && errors != null && errors != '')
						{						
							//Gets all the keys for the error arrays
							var keys = Object.keys(errors);
							
							//If the keys are not empty continue
							if(keys != undefined && keys != null && keys.length > 0)
							{
								//This loops over all the keys in the errors object
								//Note: the keys should be the name of the field registered in vee validate
								for(var i = 0; i < keys.length; i++)
								{
									//Gets the error array for that particular key
									var errorList = errors[keys[i]];
									
									//This loops over the error array supplied and adds them to the vee validate errors using the key
									for(var j = 0; j < errorList.length; j++)
									{
										this.errors.add(keys[i], errorList[j]);
									}
								}
							}
						}
						else
						{
							console.log("VeeValidateDE Error: the errors parameter for the AddAdditionalErrors function is null or empty.");
						}
					}.bind(this),
					
					//This function validates all the registered fields using the AddValidation function
					ValidateAll: function()
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