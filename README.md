# vee-validate-de
Vee Validate DE is an Extension plugin for Vee Validate which allows mapping directly to data properties rather than just being form elements.

**JSFiddle:** https://jsfiddle.net/lilpug/ktq6912L/

## Getting Started

To get started with the Vee Validate DE plugin simply include the plugin in your Vue definition along with the Vee Validate plugin
```javascript
//Loads the Vee Validate plugin into Vue
Vue.use(VeeValidate);

//Loads our Vee Validate DE plugin into Vue
Vue.use(VeeValidateDE);

var app = new Vue(
{
  el: "#app",
});
```


## How To Use

below is a generic example
To get started with the Vee Validate DE plugin simply include the plugin in your Vue definition along with the Vee Validate plugin
```javascript
var app = new Vue(
{
  el: "#app",
  data: 
  {	
    name: "john",
    age: 17      
  },
  mounted: function()
  {
    //Adds the validation to the data properties *this will also watch for changes and trigger it*
    //Note: this does not run for the first initial load, but you could call the validate all to trigger this is you needed it to.
    this.$validatorDE.AddValidation("name", "testName", "required");
    this.$validatorDE.AddValidation("age", "ageName", "required|min_value:18");  

    //validate after loading straight away example:
    //this.$validatorDE.ValidateAll();
  },
  methods: 
  {
    "ValidateAll": function()
    { 
		this.$validatorDE.ValidateAll().then(function(result)
		{
			//If the local validation went successful then fire of the ajax to the server
			if(result)
			{		
				...some form of ajax method.complete(function(data)
				{
					//If the ajax was not successful and has validation errors from the server then merge them
					if(!data.success && data.errors != null)
					{
						//Converts it from a json string to an object *if required*
						var errors = JSON.parse(data.errors);
					
						this.$validatorDE.AddAdditionalErrors(errors);
					}
				});
			}
		
		  console.log(result);
		});
    }
  }
});
```


## Extension Functions

### AddValidation

The AddValidation function creates a new Vee Validate rule and links a watch function to that particular data property, everytime a change occurs it then fires the validation for that property.

#### Syntax

* watchProperty - The data property you want to add validation to i.e. information.details.name
* errorName - The error name which represents that particular validation in Vee Validate
* validationTypes - The Vee Validate validations types i.e. "required|min_value:99"

```javascript
function(watchProperty, errorName, validationTypes)
```


### AddAdditionalErrors

The AddAdditionalErrors function takes an object that holds multiple error validation arrays and merges the errros into the vee validate error bag.

This is a useful function if your looking to merge some server side errors directly into the vee validate without having to do additional work.

 
#### Errors Property Structure

**Note:** The keys for the object have to be the same name as the error names that you registered in the AddValidation functions.

```javascript
var errors = {
	abc: ['this has failed server side validation!'],
	abc2: ['this has to be example3!', 'please correct this information']
}
```

#### Syntax

* errors - The errors object thats holding all the additional arrays you want to merge into the vee validate error bag

```javascript
function(errors)
```


### ValidateAll

The ValidateAll function takes all the registered validation properties that where added using the AddValidation function and pushes them through Vee Validates ValidateAll function, which then returns a promise.

#### Syntax

```javascript
promise function()
```


## Copyright and License
Copyright &copy; David Whitehead

You do not have to do anything special by using the MIT license and you don't have to notify anyone that your using this license. You are free to use, modify and distribute this software in normal and commercial usage as long as the copyright header is left intact (specifically the comment block which starts with /*!).