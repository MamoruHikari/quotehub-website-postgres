$(document).ready(function() {
    $('.services-bottom').hide();
    $('.service-item').click(function() {
      $(this).toggleClass('active');
      $(this).find('.services-bottom').slideToggle(150);
    });
});

$(document).ready(function() {
  $('#deleteButton').on('click', function () {
      const confirmed = confirm('Are you sure you want to delete this book?');
      if (confirmed) {
          $('#deleteForm').submit();
      }
  });
});


