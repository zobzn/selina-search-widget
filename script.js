(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function dateFormatYYYYMMDD(dateObject) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var date = dateObject.getDate();
    month = (month < 10 ? "0" : "") + month;
    date = (date < 10 ? "0" : "") + date;
    return year + "-" + month + "-" + date;
  }

  var millisecondsInDay = 24 * 3600 * 1000;
  var dateTomorrow = new Date(new Date().getTime() + millisecondsInDay);
  var dateTomorrowYYYYMMDD = dateFormatYYYYMMDD(dateTomorrow);

  qsa(".checkin-date").forEach(function (checkInInput) {
    var form = checkInInput.closest("form");
    var checkOutInput = qs(".checkout-date", form);
    var locationSelect = qs(".location-selection", form);

    checkInInput.min = dateTomorrowYYYYMMDD;
    checkInInput.addEventListener("change", function () {
      checkOutInput.valueAsNumber = this.valueAsNumber + millisecondsInDay * 30;
      checkOutInput.min = checkOutInput.value;
      checkOutInput.max = checkOutInput.value;
    });

    locationSelect.addEventListener("change", function () {
      form.action = "https://selina.com/search" + locationSelect.value;
    });

    form.addEventListener("submit", function (e) {
      var ci = checkInInput.value;
      var co = checkOutInput.value;
      var location = locationSelect.value;

      if (ci && co && location) {
        form.action = "https://selina.com/search" + location;
      } else {
        e.preventDefault();
      }
    });
  });
})();
