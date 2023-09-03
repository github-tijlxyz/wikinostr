export function formatDate(unixtimestamp: number) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const date = new Date(unixtimestamp * 1000);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

const generatedNumbers: Set<number> = new Set();

export function generateRandomNumber(): number {
  let randomNumber: number;

  do {
    randomNumber = Math.floor(Math.random() * 1000000);
  } while (generatedNumbers.has(randomNumber));

  generatedNumbers.add(randomNumber);
  return randomNumber;
}

export function scrollTabIntoView(el: string | HTMLElement, wait: boolean) {
  function scrollTab() {
    const element =
      typeof el === 'string' ? document.querySelector(`[id^="wikitab-v0-${el}"]`) : el;
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      inline: 'start'
    });
  }

  if (wait) {
    setTimeout(() => {
      scrollTab();
    }, 1);
  } else {
    scrollTab();
  }
}

export function isElementInViewport(el: string | HTMLElement) {
  const element = typeof el === 'string' ? document.querySelector(`[id^="wikitab-v0-${el}"]`) : el;
  if (!element) return;
  
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
