// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const http = require("https");
const request = require('request');
const Alexa = require('ask-sdk-core');


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Rocket Elevators, how can i help you?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// mettre le plus dinfo pertinente pour les ascenseurs batterie et columns
//- ----------------

async function putRequest(elevator_id, status, col_id, serial_number, type_of_building, model,activate_date, inspection_certificat) {
    
 return new Promise((resolve, reject) =>{
    request({
        uri: `https://rocketelevatorapi.azurewebsites.net/api/elevator/${elevator_id}`,
        method: 'PUT',
        body:  {
        "id": parseInt(elevator_id),
        "column_id": parseInt(col_id),
        "status": String(status),
        "serial_number": String(serial_number),
        "type_of_building": String(type_of_building),
        "model": String(model),
        "activate_date": String(activate_date),
        "inspection_certificat": String(inspection_certificat)
        },
        json: true,
        headers: {
            'Content-type': 'application/json'
        },
    }, (error, response, body) => {
         if(error){
            return reject(error);
         }
         return resolve(body);
    });
 });
}

var intervention_id = 0;

async function postRequest(customer_id, author, employee_id) {
    
 return new Promise((resolve, reject) =>{
    request({
        uri: `https://rocketelevatorapi.azurewebsites.net/api/intervention`,
        method: 'POST',
        body:  {
            "customer_id": parseInt(customer_id),
            "author": parseInt(author),
            "employee_id": parseInt(employee_id)
        },
        json: true,
        headers: {
            'Content-type': 'application/json'
        },
    }, (error, response, body) => {
         if(error){
            return reject(error);
         }
         return resolve(intervention_id = body);
    });
 });
}


const getRequest = function(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? require("https") : require("http");
    const request = client.get(url, response => {
      if (response.statusCode < 200 || response.statusCode >+ 300) {
        reject(new Error("Failed with status code: " + response.statusCode));
      }
      const body = [];
      response.on("data", chunk => body.push(chunk));
      response.on("end", () => resolve(body.join("")));
    });
    request.on("error", err => reject(err));
  });
};



 var global_employee_id = 0;

async function emp(employee_name) {
    
    
    
     for(var k = 1; k <= 10; k++) {
           var getEmp = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/employee/${k}`)
         if(JSON.parse(getEmp).name === employee_name){
           global_employee_id = JSON.parse(getEmp).id
           } 
       } 
       
}

var global_building_id = [];

async function get_list_building(_customer_id){
    for(var i = 1; i <= 30; i++) {
        var getBuild = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/building/${i}`)
        if(JSON.parse(getBuild).customer_id === _customer_id){
           global_building_id.push(JSON.parse(getBuild).id)
           } 
    }
    
}


 var global_customer_id = 0;
 var global_author_id = 0;
        
const ShowCustomerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowCustomerIntent';
    },
    async handle(handlerInput) {
        const name = handlerInput.requestEnvelope.request.intent.slots.name.value
        const employee_name = handlerInput.requestEnvelope.request.intent.slots.employee_name.value
        const employee = handlerInput.requestEnvelope.request.intent.slots.employee.value
        
        var name_U = name[0].toUpperCase() + name.slice(1);
        var employee_name_U = employee_name[0].toUpperCase() + employee_name.slice(1);
        var employee_U = employee[0].toUpperCase() + employee.slice(1);
        
        const all_customer = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/customer`);
        const all_employee = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/employee`);
        

       
         emp(employee_U)
         //building(customer_id)
         
       
        for(var j = 1; j <= 10; j++) {
            var getAut = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/employee/${j}`)
            if(JSON.parse(getAut).name === employee_name_U){
            global_author_id = JSON.parse(getAut).id
            } 
        } 
        
        
        for(var i = 1; i <= JSON.parse(all_customer).length; i++) {
            var getCust = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/customer/${i}`)
            if(JSON.parse(getCust).full_name === name_U){
                global_customer_id = JSON.parse(getCust).id
            } 
        }
        
        var customer = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/customer/${global_customer_id}`)
        var author = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/employee/${global_author_id}`)
        var employe = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/employee/${global_employee_id}`)
        await postRequest(global_customer_id, global_author_id, global_employee_id);
        const speakOutput = `Intervention created by ${JSON.parse(author).name} for the customer ${JSON.parse(customer).full_name} working for ${JSON.parse(customer).business_name}, for the employee ${JSON.parse(employe).name}`
        
        
        
         return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();

        
        
        
    }
};





const ShowBuildingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowBuildingIntent';
    },
    async handle(handlerInput) {
        
        
        
        await get_list_building(global_customer_id)
        
        const speakOutput = `Customer ${global_customer_id} have these building : ${global_building_id.join('-')} `;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


async function putRequestuilding(intervention_id_) {
    
 return new Promise((resolve, reject) =>{
    request({
        uri: `https://rocketelevatorapi.azurewebsites.net/api/intervention/${intervention_id_}`,
        method: 'PUT',
        body:  {
            "id": parseInt(intervention_id_),
            "customer_id": parseInt(global_customer_id),
            "author": parseInt(global_author_id),
            "employee_id": parseInt(global_employee_id),
            "building_id": parseInt(global_chosed_building),
            "result": "Incomplete",
            "status": "Inprogress"
        },
        json: true,
        headers: {
            'Content-type': 'application/json'
        },
    }, (error, response, body) => {
         if(error){
            return reject(error);
         }
         return resolve(body);
    });
 });
}



var global_chosed_building = 0;
const ChooseBuildingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChooseBuildingIntent';
    },
    async handle(handlerInput) {
       
        const id_ = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        global_chosed_building = id_;
        
        var building = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/building/${id_}`)
        var last_interv = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/intervention/max`)
        intervention_id = JSON.parse(last_interv)
        const put = await putRequestuilding(intervention_id);
        const speakOutput = `You chose building ${JSON.parse(building).id} for your intervention request ${intervention_id}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

var global_battery_id = 0;

async function get_list_battery(cc){
    for(var i = 1; i <= 30; i++) {
        var getBat = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/battery/${i}`)
        if(JSON.parse(getBat).building_id === parseInt(cc)){
           global_battery_id = JSON.parse(getBat).id
           } 
    }
    
}


const ShowBatteryInterventionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowBatteryInterventionIntent';
    },
    async handle(handlerInput) {
       
       
        
        await get_list_battery(global_chosed_building)
        
        
        const speakOutput = `Building ${global_chosed_building} have the battery ${global_battery_id}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


async function putRequestBattery(intervention_id_) {
    
 return new Promise((resolve, reject) =>{
    request({
        uri: `https://rocketelevatorapi.azurewebsites.net/api/intervention/${intervention_id_}`,
        method: 'PUT',
        body:  {
            "id": parseInt(intervention_id_),
            "customer_id": parseInt(global_customer_id),
            "author": parseInt(global_author_id),
            "employee_id": parseInt(global_employee_id),
            "building_id": parseInt(global_chosed_building),
            "battery_id": parseInt(global_chosed_battery),
            "result": "Incomplete",
            "status": "Inprogress"
        },
        json: true,
        headers: {
            'Content-type': 'application/json'
        },
    }, (error, response, body) => {
         if(error){
            return reject(error);
         }
         return resolve(body);
    });
 });
}




var global_chosed_battery = 0;

const ChooseBatteryInterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChooseBatteryInterIntent';
    },
    async handle(handlerInput) {
       
        const id_ = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        global_chosed_battery= id_;
        
        var battery = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/battery/${id_}`)

        const put = await putRequestBattery(intervention_id);
        
        const speakOutput = `You chosed the battery ${global_chosed_battery}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};





var global_column_id = [];

async function get_list_column(cc){
    for(var i = 1; i <= 30; i++) {
        var getBat = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/column/${i}`)
        if(JSON.parse(getBat).battery_id === parseInt(cc)){
           global_column_id.push(JSON.parse(getBat).id)
           } 
    }
    
}


const ShowColumnIntervIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowColumnIntervIntent';
    },
    async handle(handlerInput) {
       
       
        
        await get_list_column(global_chosed_battery)
        
        
        const speakOutput = `The battery ${global_battery_id} has the columns ${global_column_id.join("-")}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


































const ShowElevatorInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowElevatorInfoIntent';
    },
    async handle(handlerInput) {
        
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        const elevator = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/elevator/${id}`);

        
        
        
        
        const speakOutput = `The elevator ${id} serial number is ${JSON.parse(elevator).serial_number}, the model is ${JSON.parse(elevator).model}, it belongs to an ${JSON.parse(elevator).type_of_building} building, his actual status is ${JSON.parse(elevator).status}, and belongs to column ${JSON.parse(elevator).column_id}.`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};


const ElevatorStatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ElevatorStatusIntent';
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        const elevator = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/elevator/${id}`);

 
        const speakOutput = `The elevator ${id} has a status of ${JSON.parse(elevator).status}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

var global_elevator_id = 0;

const ChangeElevatorStatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeElevatorStatusIntent';
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        const elevator = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/elevator/${id}`);
        global_elevator_id = id
        const speakOutput = `With which status do you want to replace the elevator ${id} status.`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('yo baboooooooooooche')
            .getResponse();
    }
};





const ChangeStatusForElevatorIntentHandler = {
    
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeStatusForElevatorIntent';
    },
    async handle(handlerInput) {
        
        const status = handlerInput.requestEnvelope.request.intent.slots.status.value
        const elevator = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/elevator/${global_elevator_id}`);

        var status_U = status[0].toUpperCase() + status.slice(1);
 
        const putPromise = await putRequest(global_elevator_id, status_U, JSON.parse(elevator).column_id, JSON.parse(elevator).serial_number, JSON.parse(elevator).type_of_building, JSON.parse(elevator).model,JSON.parse(elevator).activate_date , JSON.parse(elevator).inspection_certificat);
       
        const speakOutput = `The elevator ${global_elevator_id} now has a status of ${status_U}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('yo baboooooooooooche')
            .getResponse();
    }
    
}



const BatteryStatusIndentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BatteryStatusIndent';
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        const battery = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/battery/${id}`);
 
        const speakOutput = `The battery ${id} has a status of ${JSON.parse(battery).status}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
}


const ShowBatteryInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowBatteryInfoIntent';
    },
    
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        const battery = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/battery/${id}`);
 
        const speakOutput = `The battery ${id} belongs to an ${JSON.parse(battery).type_of_building} building with a status of ${JSON.parse(battery).status} and belongs to building ${JSON.parse(battery).building_id}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
}


const ColumnStatusIndentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ColumnStatusIndent';
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        const column = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/column/${id}`);
 
        const speakOutput = `The column ${id} has a status of ${JSON.parse(column).status}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
}


const ShowColumnInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowColumnInfoIntent';
    },
    async handle(handlerInput) {
        const id = handlerInput.requestEnvelope.request.intent.slots.id.value
        
        const column = await getRequest(`https://rocketelevatorapi.azurewebsites.net/api/column/${id}`);
 
        const speakOutput = `The column ${id} belongs to an ${JSON.parse(column).type_of_building} building, has ${JSON.parse(column).number_of_floor} floors with a status of ${JSON.parse(column).status} and belongs to battery ${JSON.parse(column).battery_id}`;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
}



const RocketIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RocketIntent';
    },
    async handle(handlerInput) {
        
        
        const elevator = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/elevator");
        const building = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/building");
        const customer = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/customer");
        const elevatorstatus = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/elevatorstatus");
        const battery = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/battery");
        const quote = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/quote");
        const lead = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/lead/lastmonth");
        const city = await getRequest("https://rocketelevatorapi.azurewebsites.net/api/cities");
        
        const speakOutput = `Greetings, There are currently ${JSON.parse(elevator).length} elevators deployed in the ${JSON.parse(building).length} buildings of your ${JSON.parse(customer).length} customers. Currently, ${JSON.parse(elevatorstatus).length} elevators are not in Running Status and are being serviced. ${JSON.parse(battery).length} Batteries are deployed across ${JSON.parse(city).length} cities. On another note you currently have ${JSON.parse(quote).length} quotes awaiting processing. You also have ${JSON.parse(lead).length} leads in your contact requests `;
        
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RocketIntentHandler,
        ShowBatteryInterventionIntentHandler,
        ChooseBuildingIntentHandler,
        ShowColumnIntervIntentHandler,
        ElevatorStatusIntentHandler,
        ChooseBatteryInterIntentHandler,
        ShowBuildingIntentHandler,
        ShowElevatorInfoIntentHandler,
        ShowBatteryInfoIntentHandler,
        ShowColumnInfoIntentHandler,
        BatteryStatusIndentHandler,
        ShowCustomerIntentHandler,
        ColumnStatusIndentHandler,
        ChangeStatusForElevatorIntentHandler,
        ChangeElevatorStatusIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        //IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
