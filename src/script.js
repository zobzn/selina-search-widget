(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  function dateAdd(date, ms) {
    return new Date(date.getTime() + ms);
  }

  function dateParseYYYYMMDD(dateString) {
    let datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
    let parsed = datePattern.exec(dateString);
    if (!parsed) return null;
    let [, year, month, date] = parsed;
    return new Date(Date.UTC(+year, +month - 1, +date));
  }

  function dateParseDDMMYYYY(dateString) {
    let datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    let parsed = datePattern.exec(dateString);
    if (!parsed) return null;
    let [, date, month, year] = parsed;
    return new Date(Date.UTC(+year, +month - 1, +date));
  }

  function dateFormatYYYYMMDD(dateObject) {
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    month = (month < 10 ? "0" : "") + month;
    date = (date < 10 ? "0" : "") + date;
    return year + "-" + month + "-" + date;
  }

  function dateFormatDDMMYYYY(dateObject) {
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth() + 1;
    let date = dateObject.getDate();
    month = (month < 10 ? "0" : "") + month;
    date = (date < 10 ? "0" : "") + date;
    return date + "/" + month + "/" + year;
  }

  let millisecondsInDay = 24 * 3600 * 1000;
  let days1 = millisecondsInDay * 1;
  let days30 = millisecondsInDay * 30;
  let dateTomorrow = dateAdd(new Date(), days1);
  let dateTomorrowYYYYMMDD = dateFormatYYYYMMDD(dateTomorrow);

  qsa(".checkin-date").forEach(function (checkInInput) {
    let form = checkInInput.closest("form");
    let checkInHidden = qs('input[name="ci"]', form);
    let checkOutHidden = qs('input[name="co"]', form);
    let checkOutInput = qs(".checkout-date", form);
    let locationSelect = qs(".location-selection", form);

    checkInInput.type = "text";
    checkInInput.placeholder = "DD/MM/YYYY";
    checkInInput.value = dateFormatDDMMYYYY(dateTomorrow);

    checkOutInput.type = "text";
    checkOutInput.placeholder = "DD/MM/YYYY";
    checkOutInput.value = dateFormatDDMMYYYY(dateAdd(dateTomorrow, days30));

    new Pikaday({
      field: checkInInput,
      format: "DD/MM/YYYY",
      minDate: dateTomorrow,
      toString(date, format) {
        return dateFormatDDMMYYYY(date);
      },
      parse(dateString, format) {
        return dateString ? dateParseDDMMYYYY(dateString) : null;
      },
      onSelect(date) {},
    });

    checkInInput.min = dateTomorrowYYYYMMDD;
    checkInInput.addEventListener("change", function () {
      let ciDate = dateParseDDMMYYYY(checkInInput.value);
      let coDate = ciDate ? dateAdd(ciDate, days30) : null;

      checkInInput.value = ciDate ? dateFormatDDMMYYYY(ciDate) : null;
      checkOutInput.value = coDate ? dateFormatDDMMYYYY(coDate) : null;
    });

    form.addEventListener("submit", function (e) {
      let location = locationSelect.value;

      let ciDate = dateParseDDMMYYYY(checkInInput.value);
      let coDate = ciDate ? dateAdd(ciDate, days30) : null;

      let ci = ciDate ? dateFormatYYYYMMDD(ciDate) : null;
      let co = coDate ? dateFormatYYYYMMDD(coDate) : null;

      if (ci && co && location) {
        checkInHidden.value = ci;
        checkOutHidden.value = co;
        form.action = `https://selina.com/search${location}/`;
      } else {
        e.preventDefault();
      }
    });
  });
})();
