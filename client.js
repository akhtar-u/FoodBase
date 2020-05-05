$.ajax({
  url: 'http://localhost:3000/profile',
  method: 'GET',
  success: function (data) {
    getRecipes(data.sub);
    document.getElementById('userdb').innerHTML = data.nickname + "'s Recipes";
  },
});

// query recipes using userid
function getRecipes(userid) {
  $.ajax({
    url: 'http://localhost:3000/recipe/' + '/' + userid,
    method: 'GET',
  })
    .then(function (data) {
      let htmlstr = data;
      console.log(htmlstr[1]);
      $('#rec-1').html(JSON.stringify(htmlstr[0]));
    })
    .catch(function (err) {
      console.log(err);
    });
}
