const reviewEndpoint = 'https://legae-garden-guest-manager-fb615b78.base44.app/api/apps/688d9861a9e77103fb615b78/entities/Review';
const appId = '688d9861a9e77103fb615b78';
const reviewsCard = document.querySelector('#reviews');
const reviewForm = document.querySelector('#guest-review-form');
const submitButton = document.querySelector('#submit-guest-review');
const submitStatus = document.querySelector('#guest-review-status');
const publishedReviews = document.querySelector('#published-reviews');
const loadStatus = document.querySelector('#review-load-status');
const moreReviews = document.querySelector('#more-guest-reviews');
const displayedReviewIds = new Set();
const pageSize = 6;
let loadingReviews = false;
let reviewsLoaded = false;
let reviewOffset = 0;
let submittingReview = false;

function renderReview(review) {
  const figure = document.createElement('figure');
  figure.className = 'review-quote';
  const rating = document.createElement('p');
  rating.className = 'review-rating';
  rating.textContent = `${review.rating} / 5`;
  rating.setAttribute('aria-label', `${review.rating} out of 5 stars`);
  figure.append(rating);
  if (review.title) {
    const title = document.createElement('h4');
    title.textContent = review.title;
    figure.append(title);
  }
  const quote = document.createElement('blockquote');
  const comment = document.createElement('p');
  comment.textContent = review.comment;
  quote.append(comment);
  const name = document.createElement('figcaption');
  name.textContent = review.guestName;
  figure.append(quote, name);
  return figure;
}

async function loadReviews() {
  if (loadingReviews) return;
  loadingReviews = true;
  loadStatus.textContent = 'Loading guest reviews…';
  moreReviews.disabled = true;
  const parameters = new URLSearchParams({
    q: JSON.stringify({status: 'approved', isPublic: true}),
    sort: '-created_date',
    limit: String(pageSize),
    skip: String(reviewOffset),
    fields: 'id,guestName,rating,title,comment,status,isPublic',
  });
  try {
    const response = await fetch(`${reviewEndpoint}?${parameters}`, {
      headers: {'X-App-Id': appId},
      credentials: 'omit',
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Reviews could not be loaded');
    const reviews = await response.json();
    if (!Array.isArray(reviews)) throw new Error('Unexpected review response');
    for (const review of reviews) {
      if (displayedReviewIds.has(review.id) || review.status !== 'approved' || review.isPublic !== true) continue;
      displayedReviewIds.add(review.id);
      publishedReviews.append(renderReview(review));
    }
    reviewOffset += reviews.length;
    reviewsLoaded = true;
    moreReviews.hidden = reviews.length < pageSize;
    moreReviews.textContent = 'More reviews';
    loadStatus.textContent = '';
  } catch {
    loadStatus.textContent = 'Guest reviews could not be loaded. Please try again.';
    moreReviews.hidden = false;
    moreReviews.textContent = 'Try again';
  } finally {
    loadingReviews = false;
    moreReviews.disabled = false;
  }
}

reviewsCard.addEventListener('toggle', () => {
  if (reviewsCard.open && !reviewsLoaded) void loadReviews();
});
moreReviews.addEventListener('click', () => void loadReviews());
if (reviewsCard.open) void loadReviews();

for (const name of ['guestName', 'comment']) {
  reviewForm.elements.namedItem(name).addEventListener('input', (event) => {
    event.target.setCustomValidity('');
  });
}
reviewForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (submittingReview) return;
  const fields = new FormData(reviewForm);
  const guestName = String(fields.get('guestName') || '').trim();
  const comment = String(fields.get('comment') || '').trim();
  const rating = Number(fields.get('rating'));
  if (!guestName || !comment) {
    const invalidField = reviewForm.elements.namedItem(guestName ? 'comment' : 'guestName');
    invalidField.setCustomValidity(guestName ? 'Please write your review.' : 'Please enter your name.');
    invalidField.reportValidity();
    return;
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    submitStatus.textContent = 'Please choose a rating from 1 to 5.';
    return;
  }
  submittingReview = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting…';
  reviewForm.setAttribute('aria-busy', 'true');
  submitStatus.textContent = '';
  submitStatus.dataset.state = '';
  try {
    const response = await fetch(reviewEndpoint, {
      method: 'POST',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json', 'X-App-Id': appId},
      body: JSON.stringify({
        guestName,
        rating,
        title: String(fields.get('title') || '').trim(),
        comment,
        status: 'pending',
        isPublic: true,
      }),
    });
    if (!response.ok) throw new Error('Review could not be submitted');
    const savedReview = await response.json();
    if (!savedReview.id) throw new Error('Review submission was not confirmed');
    reviewForm.reset();
    submitStatus.dataset.state = 'success';
    submitStatus.textContent = 'Thank you. Your review has been received and will appear after approval.';
  } catch {
    submitStatus.dataset.state = 'error';
    submitStatus.textContent = 'We could not confirm your review was received. Please try again.';
  } finally {
    submittingReview = false;
    submitButton.disabled = false;
    submitButton.textContent = 'Submit review';
    reviewForm.removeAttribute('aria-busy');
  }
});
reviewForm.hidden = false;
