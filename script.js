(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function getDaysInMonth(year, month) {
    return [
      31,
      isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ][month];
  }

  function dateParseYYYYMMDD(dateString) {
    var datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    var parsed = datePattern.exec(dateString);
    var year = parsed[1];
    var month = parsed[2];
    var date = parsed[3];
    return new Date(Date.UTC(+year, +month - 1, +date));
  }

  function dateFormatYYYYMMDD(dateObject) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth() + 1;
    var date = dateObject.getDate();
    month = (month < 10 ? "0" : "") + month;
    date = (date < 10 ? "0" : "") + date;
    return year + "-" + month + "-" + date;
  }

  function dateAddDays(oldDate, days) {
    var newDate = new Date(oldDate.getTime());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  function dateAddMonths(oldDate, months) {
    var newDate = new Date(oldDate.getTime());
    var n = oldDate.getDate();
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + months);
    newDate.setDate(
      Math.min(n, getDaysInMonth(newDate.getFullYear(), newDate.getMonth()))
    );
    return newDate;
  }

  var dateToday = new Date(new Date().getTime());
  var dateTomorrow = dateAddDays(dateToday, 1);

  qsa(".checkin-date").forEach(function (checkInInput) {
    var form = checkInInput.closest("form");
    var checkOutInput = qs(".checkout-date", form);
    var locationSelect = qs(".location-selection", form);

    checkInInput.min = dateFormatYYYYMMDD(dateTomorrow);
    checkInInput.addEventListener("change", function () {
      var dateCheckIn = dateParseYYYYMMDD(this.value);
      var dateCheckOut = dateAddMonths(dateCheckIn, 1);
      // var dateCheckOut = dateAddDays(dateCheckIn, 30);

      checkOutInput.min = dateFormatYYYYMMDD(dateCheckOut);
      checkOutInput.max = dateFormatYYYYMMDD(dateCheckOut);
      checkOutInput.value = dateFormatYYYYMMDD(dateCheckOut);
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

(() => {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  const options = qsa("tbody tr.MuiTableRow-root")
    .map((tr) => {
      const country = qs("td:first-child + td", tr).textContent;
      const location = qs("td:first-child + td + td", tr).textContent;
      const url = qs("td:first-child + td + td + td", tr).textContent;
      return { country, location, url };
    })
    .filter(({ country, location, url }) => {
      return url.trim() !== "";
    })
    .map(({ country, location, url }) => {
      return `<option value="${url}">${country}, ${location}</option>`;
    });

  return options.join("\n");
})();
