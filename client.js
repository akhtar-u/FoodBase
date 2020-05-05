const URL = 'http://localhost:3000';

// obtain user profile and pass parameters to get data from db
$.ajax({
  url: '/' + 'profile',
  method: 'GET',
  success: function (data) {
    getRecipes(data.sub);
    $('#usertitle').html(data.nickname + "'s Recipes");
  },
});

// get all recipes for current user
function getRecipes(userid) {
  $.ajax({
    url: '/' + 'recipe' + '/' + userid,
    method: 'GET',
  })
    .then(function (data) {
      let recipes = data;
      let storedRecipes = recipes.length;
      dashboardView(recipes);
      $('#storedrec').html('Stored recipes: ' + storedRecipes);
    })
    .catch(function (err) {
      console.log(err);
    });
}

// list all recipes for user and get id of each recipe
function dashboardView(recipes) {
  recipes.forEach((element) => {
    let recipedID = element._id;

    // create list of recipes with delete/edit options
    let newDiv = document.createElement('div');
    $(newDiv).attr('class', 'recipediv');
    newDiv.setAttribute('id', recipedID);

    let newLink = document.createElement('a');
    $(newLink).attr('href', '/recipe/' + recipedID);
    $(newLink).attr('class', 'signin');

    let recipeli = document.createElement('li');
    recipeli.innerHTML = element.recipename;
    $(recipeli).attr('class', 'recipeli');

    // add material icons and checkbox
    // delete selected recipe <need to add jquery ajax>
    $(newDiv).append(
      '<a class="icona signin" onclick=deleteRecipe(this)>' +
        '<i class="material-icons">delete_outline</i></a> '
    );

    // edit selected recipe <need to add jquery ajax>
    $(newDiv).append(
      '<a class="icona signin" href=/recipe/' +
        recipedID +
        '/update>' +
        '<i class="material-icons">create</i></a> '
    );

    /* checkboxes? maybe 
    $(newDiv).append(
      '<div><input type="checkbox" id="scales" name="scales"><label for="scales">Publish?</label></div>'
    );*/

    // append elements
    $(newLink).append(recipeli);
    $(newDiv).append(newLink);
    $(recipelist).append(newDiv);
  });
}

// remove recipe item from dashboard and send AJAX delete req to DB
function deleteRecipe(element) {
  // remove from DOM
  let result = confirm('Delete this recipe?');
  if (result) {
    let divID = $(element).closest('div').attr('id');
    $('#' + divID).remove();
    $.ajax({
      url: '/' + 'recipe' + '/' + divID + '/' + 'delete',
      type: 'DELETE',
    });
  }
}
