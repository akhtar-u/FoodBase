// obtain user profile and pass parameters to get data from db
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

    let newButton = document.createElement('a');
    $(newButton).attr('class', 'signin reclink');
    $(newButton).attr('id', recipedID);
    $(newButton).on('click', fetchRecipe);
    newButton.innerHTML = element.recipename;

    $(newDiv).append(
      '<p id="rec-date">' + recipeDate.substring(0, 10) + '</p>'
    );

    // add material icons and checkbox
    // delete selected recipe
    $(newDiv).append(
      '<a class="icona signin" onclick=deleteRecipe(this)>' +
        '<i class="material-icons">delete_outline</i></a> '
    );

    // edit selected recipe
    $(newDiv).append(
      '<a class="icona signin" onclick=editRecipe(this)>' +
        '<i class="material-icons">create</i></a>'
    );

    // append elements
    $(newDiv).append(newButton);
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
  $(newInput).attr('required', true);

  $('#ing-div').append(newInput);
}

// remove extra input
function removeItem() {
  $('#ing').last().remove();
}

// submit form to add a new recipe
$('#addform').submit(function (e) {
  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: '/' + 'recipe' + '/' + 'add',
    data: form.serialize(),
  });
});

// image upload widget through cloudinary
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
          thumbnailTransformation: [{ width: 3000, height: 300, crop: 'fit' }],
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

// fetch recipe when clicked from dashboard and generate recipe modal
function fetchRecipe() {
  let recipeID = this.id;

  // get recipe data for selected recipe
  $.ajax({
    url: '/' + 'recipe' + '/' + recipeID + '/' + 'view',
    method: 'GET',
    success: function (data) {
      let modal = document.getElementById('myModal');

      // get array of ingredients
      let ingList = data.ingredients;

      ingList.forEach(appendIng);
      function appendIng(item) {
        $('.modal-ingredients').append('<li>' + item + '</li>');
      }

      // set modal content to recipe data
      $('.modal-title').text(data.recipename);
      $('.modal-image').attr('src', data.image);
      $('.modal-instructions').text(data.instructions);

      // display modal when recipe clicked
      modal.style.display = 'block';

      // close modal and clear previous entries
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = 'none';
          $('.modal-image').attr('src', '');
          $('.modal-ingredients').empty();
        }
      };
    },
  });
}

// fetch recipe when clicked from dashboard and generate edit form
function editRecipe(element) {
  let recipeID = $(element).closest('div').attr('id');

  // get recipe data for selected recipe
  $.ajax({
    url: '/' + 'recipe' + '/' + recipeID + '/' + 'view',
    method: 'GET',
    success: function (data) {
      let modal = document.getElementById('editModal');

      // get array of ingredients
      let ingList = data.ingredients;

      ingList.forEach(appendIng);
      function appendIng(item) {
        $('#ing-div').append(
          "<input name='ingredients' type='text' placeholder='' id='ing'" +
            "class='item' value=" +
            item +
            ' required>'
        );
      }

      $('#rec-name').val(data.recipename);
      $('#currentimage').attr('src', data.image);
      $('#ins-input').text(data.instructions);
      $('#id-input').val(data._id);
      $('#editform').attr(
        'action',
        '/' + 'recipe' + '/' + $('#id-input').val() + '/' + 'update'
      );

      if (data.public == false) {
        $('#public').val('no');
      }
      // if new image isnt picked, keep current image
      if ($('#image-url').val() == '') {
        $('#image-url').val(data.image);
      }

      // submit editted data for recipe and reload
      // check if inputs are empty
      $('#submit').click(function () {
        let empty = $('#ing-div')
          .find('input')
          .filter(function () {
            return this.value === '';
          });
        if (empty.length) {
          alert('Input can not be left blank');
        } else {
          $.ajax({
            url: '/' + 'recipe' + '/' + $('#id-input').val() + '/' + 'update',
            type: 'PUT',
            data: $('#editform').serialize(),
            success: function (result) {
              location.href = window.location.href;
            },
          });
        }
      });

      // display modal when recipe clicked
      modal.style.display = 'block';

      // close modal and clear previous entries
      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = 'none';
          $('#rec-name').attr('src', '');
          $('#rec-name').val('');
          $('#public').val('yes');
          $('.modal-ingredients').empty();
          $('.feature_thumb').empty();
          $('#ing-div').empty();
          $('#editform').attr('action', '');
          $('#upload_widget').attr('disabled', false);
        }
      };
    },
  });
}
