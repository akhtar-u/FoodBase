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
      // check if on dashboard
      if (window.location.href == 'http://localhost:3000/dashboard') {
        dashboardView(recipes);
        $('#storedrec').html('Stored recipes: ' + storedRecipes);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

// list all recipes for user and get id of each recipe
function dashboardView(recipes) {
  recipes.forEach((element) => {
    let recipedID = element._id;
    let recipeDate = element.createdAt;

    // create list of recipes with delete/edit options
    let newDiv = document.createElement('div');
    $(newDiv).attr('class', 'recipediv');
    newDiv.setAttribute('id', recipedID);
    $(newDiv).addClass(element.recipename);

    let newLink = document.createElement('a');
    $(newLink).attr('href', '/recipe/' + recipedID);
    $(newLink).attr('class', 'signin');

    let recipeli = document.createElement('li');
    recipeli.innerHTML = element.recipename;
    $(recipeli).attr('class', 'recipeli');

    $(newDiv).append(
      '<p id="rec-date">' + recipeDate.substring(0, 10) + '</p>'
    );

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
        '<i class="material-icons">create</i></a>'
    );

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

// search recipe by name / hide which don't match
function searchDB() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('searchdb');
  filter = input.value.toUpperCase();
  ul = document.getElementById('recipelist');
  div = ul.getElementsByTagName('div');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < div.length; i++) {
    a = div[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      div[i].style.display = '';
    } else {
      div[i].style.display = 'none';
    }
  }
}

// image preview for adding a new recipe
function previewImg(event) {
  let imgUpload = document.getElementById('img-upload');
  imgUpload.src = URL.createObjectURL(event.target.files[0]);
  imgUpload.onload = function () {
    URL.revokeObjectURL(output.src); // free memory
  };
}

// add input for another ingredient
function addItem() {
  let newInput = document.createElement('input');
  $(newInput).attr('class', 'item');
  $(newInput).attr('id', 'ing');

  $('#ing-div').append(newInput);
}
