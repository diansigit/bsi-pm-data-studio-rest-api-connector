var cc = DataStudioApp.createCommunityConnector();

/**
 * Returns the Auth Type of this connector.
 * @return {object} The Auth type.
 */
function getAuthType(){
    return cc.newAuthTypeResponse()
        .setAuthType(cc.AuthType.NONE)
        .build();
}

/*
* This function generates the visual elements seen on the config screen.
* It also sets the date range to required. This ensures that Google Data Studio will always send the date range of a given widget
* in the request JSON.
*/
function getConfig(request){
    var config = cc.getConfig();

    config
        .newTextInput()
        .setId('api_url')
        .setName(
            'Enter a the url to the json resource'
        )
        .setHelpText('e.g. https://mysite/api/data.json&API_KEY=mykey')
        .setPlaceholder('https://mysite/api/data.json&API_KEY=mykey')
        .setAllowOverride(true);

    return config.build();
}

function isAdminUser(request){
    return true;
}

function getFields(request) {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;
  
  fields.newDimension()
    .setId('no')
    .setType(types.NUMBER);

  fields
    .newDimension()
    .setId('team')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('product')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('inisiative')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('estimated_start')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId('estimated_end')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId('is_plan')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('status')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('quarter')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('year')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('notes')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('date_of_to_do')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId('date_of_in_progress')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId('date_of_done')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId('date_of_postpone')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId('date_of_cancel')
    .setType(types.YEAR_MONTH_DAY);

  return fields;
}

// https://developers.google.com/datastudio/connector/reference#getschema
function getSchema(request){
    return {schema: getFields(request).build()};
}

function getData(request){
  const requestedFieldIds = request.fields.map(function (field){
    return field.name;
  });
  const requestedFields = getFields().forIds(requestedFieldIds);
 
  var apiResponse = fetchDataFromApi(request);
  var parsedResponse = JSON.parse(apiResponse).data;
  var rows = responseToRows(requestedFields, parsedResponse);
  
  return {
    schema: requestedFields.build(),
    rows: rows
  };
}
  
/**
 * Gets response for UrlFetchApp.
 *
 * @param {Object} request Data request parameters.
 * @returns {string} Response text for UrlFetchApp.
 */
function fetchDataFromApi(request){
    const url = request.configParams.api_url;
    const response = UrlFetchApp.fetch(url);
    return response;
}

function responseToRows(requestedFields, response) {
  // Transform parsed data and filter for requested fields
  return response.map(function(innitiative) {
    var row = [];
    requestedFields.asArray().forEach(function (field) {
      switch (field.getId()) {
        case 'no':
          return row.push(innitiative.no);
        case 'team':
          return row.push(innitiative.team);
        case 'product':
          return row.push(innitiative.product);
        case 'inisiative':
          return row.push(innitiative.inisiative);
        case 'estimated_start':
          return row.push(innitiative.estimated_start);
        case 'estimated_end':
          return row.push(innitiative.estimated_end);
        case 'is_plan':
          return row.push(innitiative.is_plan);
        case 'status':
          return row.push(innitiative.status);
        case 'quarter':
          return row.push(innitiative.quarter);
        case 'year':
          return row.push(innitiative.year);
        case 'notes':
          return row.push(innitiative.notes);
        case 'date_of_to_do':
          return row.push(innitiative.date_of_to_do);
        case 'date_of_in_progress':
          return row.push(innitiative.date_of_in_progress);
        case 'date_of_done':
          return row.push(innitiative.date_of_done);
        case 'date_of_postpone':
          return row.push(innitiative.date_of_postpone);
        case 'date_of_cancel':
          return row.push(innitiative.date_of_cancel);
        default:
          return row.push('');
      }
    });
    return { values: row };
  });
}
