/**
 * Month calendar for the DSA site.
 *
 * Renders a month grid (desktop) plus an agenda list of the same month
 * (phones), and opens a day's events in a modal dialog. Event data lives in
 * js/calendar-events.js so it can be edited without touching this file.
 */
(function () {
  "use strict";

  var MAX_CHIPS_PER_DAY = 2;
  var SWIPE_MIN_DISTANCE = 50; // px of horizontal travel before a swipe counts

  var monthYearFormat = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  });
  var agendaDayFormat = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
  var fullDayFormat = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  var grid = document.getElementById("calendar");
  var agenda = document.getElementById("agenda");
  var monthYear = document.getElementById("monthYear");
  var prevBtn = document.getElementById("prevMonth");
  var nextBtn = document.getElementById("nextMonth");
  var todayBtn = document.getElementById("todayBtn");
  var agendaHeading = document.getElementById("agendaHeading");
  var modal = document.getElementById("eventModal");
  var modalTitle = document.getElementById("eventModalTitle");
  var modalBody = document.getElementById("eventModalBody");
  var modalClose = document.getElementById("closeModal");

  if (!grid || !monthYear || !modal) return;

  var eventsByDate = groupByDate(
    typeof CALENDAR_EVENTS !== "undefined" ? CALENDAR_EVENTS : []
  );

  var today = startOfDay(new Date());
  var viewDate = initialMonth();
  var lastFocused = null;

  /**
   * Opens on the current month, or - when it is empty, as happens between
   * semesters - on the next month that has something in it, so the page never
   * loads on a blank grid. The Today button always returns to the real one.
   */
  function initialMonth() {
    var current = new Date(today.getFullYear(), today.getMonth(), 1);
    var upcoming = Object.keys(eventsByDate)
      .filter(function (key) {
        return parseKey(key) >= current;
      })
      .sort()[0];

    if (!upcoming) return current;

    var next = parseKey(upcoming);
    return new Date(next.getFullYear(), next.getMonth(), 1);
  }

  /* ---------------------------------------------------------------- dates */

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /** Local-time YYYY-MM-DD. Avoids the UTC shift of date.toISOString(). */
  function toKey(date) {
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + month + "-" + day;
  }

  /** Parses YYYY-MM-DD as a local date; new Date(key) would parse it as UTC. */
  function parseKey(key) {
    var parts = String(key).split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function groupByDate(list) {
    var map = {};
    list.forEach(function (item) {
      if (!item || !item.date || !item.title) return;
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }

  /* --------------------------------------------------------------- render */

  function render() {
    var year = viewDate.getFullYear();
    var month = viewDate.getMonth();

    var label = monthYearFormat.format(viewDate);

    monthYear.textContent = label;
    if (agendaHeading) agendaHeading.textContent = "Events in " + label;
    renderGrid(year, month);
    renderAgenda(year, month);
  }

  function renderGrid(year, month) {
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var leading = new Date(year, month, 1).getDay();
    var trailing = (7 - ((leading + daysInMonth) % 7)) % 7;
    var fragment = document.createDocumentFragment();
    var i;

    for (i = 0; i < leading; i++) {
      fragment.appendChild(buildFiller());
    }

    for (var day = 1; day <= daysInMonth; day++) {
      fragment.appendChild(buildDay(new Date(year, month, day)));
    }

    for (i = 0; i < trailing; i++) {
      fragment.appendChild(buildFiller());
    }

    grid.innerHTML = "";
    grid.appendChild(fragment);
  }

  function buildFiller() {
    var filler = document.createElement("div");
    filler.className = "day day--filler";
    filler.setAttribute("aria-hidden", "true");
    return filler;
  }

  function buildDay(date) {
    var key = toKey(date);
    var dayEvents = eventsByDate[key] || [];
    var hasEvents = dayEvents.length > 0;

    // Days with events are buttons so they are reachable by keyboard.
    var cell = document.createElement(hasEvents ? "button" : "div");
    cell.className = "day";
    if (hasEvents) {
      cell.type = "button";
      cell.classList.add("day--has-events");
      cell.dataset.date = key;
      cell.setAttribute(
        "aria-label",
        fullDayFormat.format(date) +
          ": " +
          dayEvents
            .map(function (item) {
              return item.title;
            })
            .join(", ")
      );
    }
    if (date.getTime() === today.getTime()) {
      cell.classList.add("day--today");
      cell.setAttribute("aria-current", "date");
    } else if (date < today) {
      cell.classList.add("day--past");
    }

    var number = document.createElement("span");
    number.className = "day__number";
    number.textContent = date.getDate();
    cell.appendChild(number);

    if (hasEvents) {
      // Compact dots on phones, full title chips from tablet up. Both are in
      // the DOM; the stylesheet shows whichever suits the viewport.
      var dots = document.createElement("span");
      dots.className = "day__dots";
      dots.setAttribute("aria-hidden", "true");
      for (var d = 0; d < Math.min(dayEvents.length, 3); d++) {
        var dot = document.createElement("span");
        dot.className = "day__dot";
        dots.appendChild(dot);
      }
      cell.appendChild(dots);

      var chips = document.createElement("span");
      chips.className = "day__chips";
      chips.setAttribute("aria-hidden", "true");
      dayEvents.slice(0, MAX_CHIPS_PER_DAY).forEach(function (item) {
        var chip = document.createElement("span");
        chip.className = "day__chip";
        chip.textContent = item.title;
        chips.appendChild(chip);
      });
      if (dayEvents.length > MAX_CHIPS_PER_DAY) {
        var more = document.createElement("span");
        more.className = "day__more";
        more.textContent = "+" + (dayEvents.length - MAX_CHIPS_PER_DAY) + " more";
        chips.appendChild(more);
      }
      cell.appendChild(chips);
    }

    return cell;
  }

  function renderAgenda(year, month) {
    if (!agenda) return;

    var keys = Object.keys(eventsByDate)
      .filter(function (key) {
        var date = parseKey(key);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .sort();

    agenda.innerHTML = "";

    if (!keys.length) {
      var empty = document.createElement("p");
      empty.className = "agenda__empty";
      empty.textContent = "No events scheduled this month.";
      agenda.appendChild(empty);
      return;
    }

    var list = document.createElement("ul");
    list.className = "agenda__list";

    keys.forEach(function (key) {
      var date = parseKey(key);
      eventsByDate[key].forEach(function (item) {
        var entry = document.createElement("li");
        entry.className = "agenda__item";
        if (date < today) entry.classList.add("agenda__item--past");

        var when = document.createElement("p");
        when.className = "agenda__date";
        when.textContent = agendaDayFormat.format(date);

        var title = document.createElement("h3");
        title.className = "agenda__title";
        title.textContent = item.title;

        var details = document.createElement("p");
        details.className = "agenda__details";
        details.textContent = item.details || "";

        entry.appendChild(when);
        entry.appendChild(title);
        entry.appendChild(details);
        list.appendChild(entry);
      });
    });

    agenda.appendChild(list);
  }

  /* ---------------------------------------------------------------- modal */

  function openDay(key, trigger) {
    var dayEvents = eventsByDate[key];
    if (!dayEvents || !dayEvents.length) return;

    lastFocused = trigger || null;
    modalTitle.textContent = fullDayFormat.format(parseKey(key));
    modalBody.innerHTML = "";

    dayEvents.forEach(function (item) {
      var block = document.createElement("article");
      block.className = "modal__event";

      var title = document.createElement("h3");
      title.textContent = item.title;

      var details = document.createElement("p");
      details.textContent = item.details || "";

      block.appendChild(title);
      block.appendChild(details);
      modalBody.appendChild(block);
    });

    modal.hidden = false;
    document.body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  }

  /* --------------------------------------------------------------- events */

  function goToMonth(offset) {
    // Rebuilt from the first of the month: setMonth() on a day-31 date would
    // overflow (Jan 31 + 1 month lands in March).
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    render();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goToMonth(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goToMonth(1);
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener("click", function () {
      viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
      render();
    });
  }

  grid.addEventListener("click", function (event) {
    // A swipe that starts on an event day still fires a click on release in
    // some browsers; ignore the tap that immediately follows a swipe.
    if (Date.now() < suppressClickUntil) return;

    var cell = event.target.closest(".day--has-events");
    if (cell) openDay(cell.dataset.date, cell);
  });

  modal.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (modal.hidden) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;

    // Keep Tab cycling inside the dialog while it is open.
    var focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    var active = document.activeElement;

    if (!modal.contains(active)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Swipe left/right on the grid to change months on touch devices.
  var touchStartX = 0;
  var touchStartY = 0;
  var tracking = false;
  var suppressClickUntil = 0;

  grid.addEventListener(
    "touchstart",
    function (event) {
      if (event.touches.length !== 1) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      tracking = true;
    },
    { passive: true }
  );

  grid.addEventListener(
    "touchend",
    function (event) {
      if (!tracking) return;
      tracking = false;

      var touch = event.changedTouches[0];
      var deltaX = touch.clientX - touchStartX;
      var deltaY = touch.clientY - touchStartY;

      // Ignore anything that looks more like a vertical scroll than a swipe.
      if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE) return;
      if (Math.abs(deltaX) < Math.abs(deltaY) * 1.5) return;

      suppressClickUntil = Date.now() + 400;
      goToMonth(deltaX < 0 ? 1 : -1);
    },
    { passive: true }
  );

  render();
})();
