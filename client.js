const URLdb = 'http://localhost:3000/dashboard';
const URLform = 'http://localhost:3000/recform';

// obtain user profile and pass parameters to get data from db
if (window.location.href == URLdb) {
  $.ajax({
    url: '/' + 'profile',
    method: 'GET',
    success: function (data) {
      let userid = data.sub;
      let emailVerified = data.email_verified;

      if (emailVerified == true) {
        $('#userid-input').attr('value', userid);
        getRecipes(userid);
      } else {
        verify();
      }

      $('#usertitle').html(data.nickname + "'s Recipes");
    },
  });
}

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

// ask user to verify email before being able to use website
function verify() {
  $('.main-db').html('Please verify your email!');
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
    $(newLink).attr('class', 'signin');
    $(newLink).attr('id', recipedID);
    $(newLink).on('click', fetchRecipe);

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
    let storedRec = $('#storedrec').text();
    let count = parseInt(storedRec.substring(16, storedRec.length));

    count--;
    $('#storedrec').text('Stored recipes: ' + count);

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
  var input, filter, ul, a, i, txtValue;
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

// add input for another ingredient
function addItem() {
  let newInput = document.createElement('input');
  $(newInput).attr('class', 'item');
  $(newInput).attr('id', 'ing');
  $(newInput).attr('name', 'ingredients');

  $('#ing-div').append(newInput);
}

// submit form
$('#addform').submit(function (e) {
  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: '/' + 'recipe' + '/' + 'add',
    data: form.serialize(),
  });
});

// image upload widget through cloudinary
if (window.location.href == URLform) {
  $(document).ready(function () {
    document.getElementById('upload_widget').addEventListener(
      'click',
      function () {
        document.getElementById('upload_widget').disabled = true;

        cloudinary.openUploadWidget(
          {
            cloud_name: 'dnemvvifx',
            sources: [
              'local',
              'url',
              'camera',
              'image_search',
              'facebook',
              'dropbox',
              'google_photos',
            ],
            upload_preset: 'ml_default',
            thumbnails: '.feature_thumb',
            thumbnailTransformation: [
              { width: 3000, height: 300, crop: 'fit' },
            ],
            return_delete_token: true,
            multiple: false,
          },
          (error, result) => {
            if (result.event === 'success') {
              $('#image-url').attr('value', result.info.secure_url);
            }
          }
        );
      },
      false
    );
    $('.cloudinary-delete').attr('color', 'white');
  });
}

// fetch recipe when clicked from dashboard and show popup
function fetchRecipe() {
  let recipeID = this.id;
}
