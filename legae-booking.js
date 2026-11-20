const bookingBase = 'https://legaegardenhome1.simplybook.me/v2/book/';
const whatsappBase = 'https://wa.me/26771252032';
const bookingOrigin = new URL(bookingBase).origin;
const simplyBookFields = {
  guestCount: '218a1d839c1d56a4277120b8d7f410b8',
  estimate: '010f99d90fd64a7b2ebb99167a81fc79',
};
const rates = {
  apartment: 1000,
  includedGuestsPerApartment: 4,
  extraStayGuest: 100,
  venue: 1000,
  includedEventGuests: 10,
  extraEventGuest: 100,
  poolAdult: 100,
  poolChild: 50,
  cooler: 50,
  braai: 50,
};
const amountFormat = new Intl.NumberFormat('en-BW', {maximumFractionDigits: 0});
const money = (amount) => `BWP ${amountFormat.format(amount)}`;
const quantity = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`;
const bookingCalculator = document.querySelector('#booking-calculator');
const field = (name) => bookingCalculator.elements.namedItem(name);
const bookingType = field('type');
const fieldGroups = bookingCalculator.querySelectorAll('[data-fields]');
const estimateTotal = document.querySelector('#estimate-total');
const estimateLines = document.querySelector('#estimate-lines');
const calculatorNote = document.querySelector('#calculator-note');
const apartmentDetails = document.querySelector('#apartment-details');
const apartmentDetailsName = document.querySelector('#apartment-details-name');
const apartmentDetailsRooms = document.querySelector('#apartment-details-rooms');
const bookingFrame = document.querySelector('#booking-frame');
const calendarPanel = document.querySelector('#calendar');
const isBoltPreview = window.location.hostname.endsWith('.webcontainer-api.io');
if (isBoltPreview) bookingFrame.setAttribute('credentialless', '');
const calendarBooking = document.querySelector('#calendar-booking');
const checkoutEstimate = document.querySelector('#checkout-estimate');
const checkoutEstimateTotal = document.querySelector('#checkout-estimate-total');
const copyEstimate = document.querySelector('#copy-estimate');
const copyEstimateStatus = document.querySelector('#copy-estimate-status');
const calendarSelection = document.querySelector('#calendar-selection span');
const directBooking = document.querySelector('#direct-booking');
const bookingHelp = document.querySelector('#booking-help');
const calendarMessage = document.querySelector('#calendar-message');
const calendarMessageText = document.querySelector('#calendar-message-text');
const calendarMessageAction = document.querySelector('#calendar-message-action');
let bookingPrefill = null;
let appliedBookingPrefill = '';

window.addEventListener('message', (event) => {
  if (event.origin !== bookingOrigin || event.source !== bookingFrame.contentWindow ||
      event.data?.event !== 'appReady' || !bookingPrefill) return;

  // Pass only the calculator values through SimplyBook's widget configuration.
  bookingFrame.contentWindow.postMessage({
    update_config: true,
    rerender: false,
    config_vars: {predefined: bookingPrefill},
  }, bookingOrigin);
  appliedBookingPrefill = JSON.stringify(bookingPrefill);
});

function refreshBookingPrefill() {
  if (!calendarPanel.open || !bookingPrefill || !appliedBookingPrefill ||
      appliedBookingPrefill === JSON.stringify(bookingPrefill)) return;

  // Reload on a committed quote change so checkout cannot retain a previous estimate.
  appliedBookingPrefill = '';
  bookingFrame.src = bookingFrame.src;
}

function rateLine(count, noun, rate, plural) {
  return [`${quantity(count, noun, plural)} × ${money(rate)}`, count * rate];
}

function readEstimate(type, valid) {
  if (type === 'stay') {
    const apartment = field('apartment');
    const bothApartments = apartment.value === 'both';
    const apartments = bothApartments ? 2 : 1;
    const nights = field('nights').valueAsNumber;
    const guests = field('stay-guests').valueAsNumber;
    const includedGuests = rates.includedGuestsPerApartment * apartments;
    const booking = {
      serviceId: bothApartments ? undefined : apartment.value,
      selection: `Accommodation · ${apartment.selectedOptions[0].textContent}`,
      lines: [],
      note: 'Enter at least one night and one person.',
    };
    if (!valid) return booking;

    booking.guestCount = guests;
    const duration = quantity(nights, 'night');
    const nightlyRate = rates.apartment * apartments;
    booking.selection += ` · ${quantity(guests, 'person', 'people')} · ${duration}`;
    booking.lines.push([`${quantity(apartments, 'apartment')} · ${duration} × ${money(nightlyRate)}`, nightlyRate * nights]);
    const inclusion = bothApartments ? 'Both apartments include' : 'One apartment includes';
    booking.note = `${inclusion} ${includedGuests} people. Extra guests cost ${money(rates.extraStayGuest)} per person per night.`;
    const extraGuests = guests - includedGuests;
    if (extraGuests > 0) {
      booking.lines.push([
        `${quantity(extraGuests, 'extra guest')} × ${money(rates.extraStayGuest)} × ${duration}`,
        extraGuests * rates.extraStayGuest * nights,
      ]);
    }
    if (bothApartments) booking.inquiry = 'Ask us on WhatsApp to confirm dates when both apartments are available.';
    return booking;
  }

  if (type === 'event') {
    const guests = field('event-guests').valueAsNumber;
    const apartments = Number(field('event-apartments').value);
    if (!valid) {
      return {selection: 'Private event', lines: [], note: 'Enter a guest count from 1 to 50.'};
    }
    const accommodation = apartments ? quantity(apartments, 'apartment') : 'Venue only';
    const lines = [[`Venue hire · up to ${rates.includedEventGuests} guests`, rates.venue]];
    const extraGuests = guests - rates.includedEventGuests;
    if (extraGuests > 0) lines.push(rateLine(extraGuests, 'extra guest', rates.extraEventGuest));
    if (apartments) lines.push(rateLine(apartments, 'apartment', rates.apartment));

    return {
      selection: `Private event · ${quantity(guests, 'guest')} · ${accommodation}`,
      lines,
      note: 'Estimate for one event. Apartment add-ons cover one night.',
      inquiry: 'Ask us on WhatsApp to check event availability and confirm your package.',
    };
  }

  const adults = field('pool-adults').valueAsNumber;
  const children = field('pool-children').valueAsNumber;
  const coolers = field('pool-coolers').valueAsNumber;
  const lines = [];
  if (valid && adults + children > 0) {
    if (adults) lines.push(rateLine(adults, 'adult', rates.poolAdult));
    if (children) lines.push(rateLine(children, 'child', rates.poolChild, 'children'));
    if (coolers) lines.push(rateLine(coolers, 'cooler box', rates.cooler, 'cooler boxes'));
    if (field('pool-braai').checked) lines.push(['Braai use', rates.braai]);
  }
  return {
    serviceId: '7',
    guestCount: adults + children,
    selection: lines.length
      ? `Pool visit · ${quantity(adults + children, 'person', 'people')}`
      : 'Pool visit',
    lines,
    note: lines.length ? 'Estimate for one pool visit.' : 'Enter at least one swimmer and use whole numbers for all quantities.',
  };
}

function renderCalendar({serviceId, selection, note, inquiry, guestCount}, estimate) {
  const url = serviceId ? `${bookingBase}service/${serviceId}/` : '';
  const fields = estimate ? {
    [simplyBookFields.guestCount]: String(guestCount),
    [simplyBookFields.estimate]: String(estimate),
  } : {};
  bookingPrefill = url ? {service: serviceId, fields} : null;
  const message = `Hello, I’d like to check availability at Legae Garden Home for: ${selection}.`;
  bookingHelp.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
  calendarMessageAction.href = bookingHelp.href;
  calendarMessageAction.hidden = !inquiry;
  calendarSelection.textContent = selection;
  directBooking.hidden = !url;
  calendarBooking.hidden = !url;
  calendarMessage.hidden = Boolean(url);
  if (!url) {
    calendarMessageText.textContent = inquiry || note;
    return;
  }
  directBooking.href = url;
  if (bookingFrame.getAttribute('src') !== url) {
    appliedBookingPrefill = '';
    bookingFrame.src = url;
  }
  bookingFrame.title = `Live SimplyBook availability for ${selection}`;
}

function updateApartmentDetails() {
  const isStay = bookingType.value === 'stay';
  const isEvent = bookingType.value === 'event';
  const selection = field(isStay ? 'apartment' : 'event-apartments');
  const count = isStay ? (selection.value === 'both' ? 2 : 1) : (isEvent ? Number(selection.value) : 0);
  apartmentDetails.hidden = count === 0;
  if (!count) return;

  // Each apartment has the layout described in the property information.
  apartmentDetailsName.textContent = selection.selectedOptions[0].textContent;
  apartmentDetailsRooms.textContent = [
    quantity(count * 2, 'bedroom'),
    quantity(count, 'equipped kitchen'),
    quantity(count, 'living room'),
    quantity(count * 2, 'bathroom'),
  ].join(' · ');
}

function updateCalculator() {
  updateApartmentDetails();
  const valid = bookingCalculator.checkValidity();
  const result = readEstimate(bookingType.value, valid);
  const total = result.lines.reduce((sum, [, price]) => sum + price, 0);
  const hasEstimate = result.lines.length > 0;
  estimateTotal.value = hasEstimate ? money(total) : '—';
  checkoutEstimate.hidden = !hasEstimate;
  checkoutEstimateTotal.textContent = estimateTotal.value;
  if (copyEstimate.value !== String(total)) copyEstimateStatus.textContent = '';
  copyEstimate.value = String(total);
  calculatorNote.textContent = result.note;
  estimateLines.replaceChildren(...result.lines.map(([label, amount]) => {
    const row = document.createElement('li');
    const detail = document.createElement('span');
    const price = document.createElement('span');
    detail.textContent = label;
    price.textContent = money(amount);
    row.append(detail, price);
    return row;
  }));
  renderCalendar(result, total);
}

function updateBookingType() {
  for (const group of fieldGroups) {
    group.hidden = group.dataset.fields !== bookingType.value;
    group.querySelectorAll('input, select').forEach((control) => { control.disabled = group.hidden; });
  }
  updateCalculator();
}

function isPlainClick(event) {
  return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
}

bookingCalculator.addEventListener('submit', (event) => {
  event.preventDefault();
  updateCalculator();
});
bookingCalculator.addEventListener('input', (event) => {
  if (event.target !== bookingType) updateCalculator();
});
bookingType.addEventListener('change', updateBookingType);
bookingCalculator.addEventListener('change', refreshBookingPrefill);
copyEstimate.hidden = !navigator.clipboard?.writeText;
copyEstimate.addEventListener('click', async () => {
  const amount = copyEstimate.value;
  try {
    await navigator.clipboard.writeText(amount);
    if (copyEstimate.value === amount) copyEstimateStatus.textContent = 'Amount copied';
  } catch {
    copyEstimateStatus.textContent = 'Copy the amount shown.';
  }
});
document.querySelectorAll('[data-booking]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!isPlainClick(event)) return;
    bookingType.value = link.dataset.booking;
    updateBookingType();
  });
});
updateBookingType();

function openLinkedDetails(target = document.getElementById(window.location.hash.slice(1))) {
  let details = target?.closest('details');
  while (details) {
    details.open = true;
    details = details.parentElement?.closest('details');
  }
}
document.querySelectorAll('a[href="#calendar"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (isPlainClick(event)) {
      calendarPanel.open = true;
      refreshBookingPrefill();
    }
  });
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (isPlainClick(event)) openLinkedDetails(document.getElementById(link.hash.slice(1)));
  });
});
calendarPanel.addEventListener('toggle', refreshBookingPrefill);
window.addEventListener('hashchange', () => openLinkedDetails());
openLinkedDetails();

const menuButton = document.querySelector('.menu-toggle');
function setMenuOpen(isOpen) {
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuButton.querySelector('use').setAttribute('href', isOpen ? '#i-close' : '#i-menu');
}
menuButton.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') === 'false'));
document.querySelectorAll('.nav a, .nav-book').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});
document.querySelector('.header').addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});

const hero = document.querySelector('.hero');
const heroSlides = [...hero.querySelectorAll('.hero-slide')];
const heroPause = document.querySelector('#hero-pause');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroPhotoIndex = 0;
let heroPaused = reducedMotion.matches;

function showHeroPhoto(index) {
  heroPhotoIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === heroPhotoIndex;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
}

function updateHeroPause() {
  heroPause.textContent = heroPaused ? 'Play photos' : 'Pause photos';
  heroPause.setAttribute('aria-pressed', String(heroPaused));
}

hero.querySelector('.hero-controls').hidden = false;
showHeroPhoto(0);
updateHeroPause();
document.querySelector('#hero-previous').addEventListener('click', () => showHeroPhoto(heroPhotoIndex - 1));
document.querySelector('#hero-next').addEventListener('click', () => showHeroPhoto(heroPhotoIndex + 1));
heroPause.addEventListener('click', () => {
  heroPaused = !heroPaused;
  updateHeroPause();
});
reducedMotion.addEventListener('change', (event) => {
  if (event.matches) {
    heroPaused = true;
    updateHeroPause();
  }
});
window.setInterval(() => {
  if (!heroPaused && !document.hidden && !hero.matches(':focus-within')) {
    showHeroPhoto(heroPhotoIndex + 1);
  }
}, 6500);

const gallery = [...document.querySelectorAll('.gallery-grid a')];
const photoDialog = document.querySelector('#photo-dialog');
const photo = document.querySelector('#full-photo');
const photoCaption = document.querySelector('#photo-caption');
let activePhoto = 0;

function showPhoto(index) {
  activePhoto = (index + gallery.length) % gallery.length;
  const item = gallery[activePhoto];
  photo.src = item.href;
  photo.alt = item.querySelector('img').alt;
  photoCaption.textContent = item.querySelector('span').textContent.trim();
}
gallery.forEach((item, i) => {
  item.addEventListener('click', (event) => {
    if (!isPlainClick(event) || !photoDialog.showModal) return;
    event.preventDefault();
    showPhoto(i);
    photoDialog.showModal();
  });
});
photoDialog.querySelector('.prev').addEventListener('click', () => showPhoto(activePhoto - 1));
photoDialog.querySelector('.next').addEventListener('click', () => showPhoto(activePhoto + 1));
photoDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(activePhoto + 1);
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const {left, right, top, bottom} = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
  });
});

export {};
